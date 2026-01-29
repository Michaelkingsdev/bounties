import { NextResponse } from 'next/server';
import { BountyStore } from '@/lib/store';
import { CompetitionParticipation } from '@/types/participation';

const generateId = () => crypto.randomUUID();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: bountyId } = await params;

    try {
        const body = await request.json();
        const { contributorId } = body;

        if (!contributorId) {
            return NextResponse.json({ error: 'Missing contributorId' }, { status: 400 });
        }

        const bounty = BountyStore.getBountyById(bountyId);
        if (!bounty) {
            return NextResponse.json({ error: 'Bounty not found' }, { status: 404 });
        }

        if (bounty.claimingModel !== 'competition') {
            return NextResponse.json({ error: 'Invalid claiming model for this action' }, { status: 400 });
        }

        const existing = BountyStore.getCompetitionParticipationsByBounty(bountyId)
            .find(p => p.contributorId === contributorId);

        if (existing) {
            return NextResponse.json({ error: 'Already joined this competition' }, { status: 409 });
        }

        const participation: CompetitionParticipation = {
            id: generateId(),
            bountyId,
            contributorId,
            status: 'registered',
            registeredAt: new Date().toISOString()
        };

        BountyStore.addCompetitionParticipation(participation);

        return NextResponse.json({ success: true, data: participation });

    } catch (error) {
        console.error('Error joining competition:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
