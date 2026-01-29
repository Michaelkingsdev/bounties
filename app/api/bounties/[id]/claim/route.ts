import { NextResponse } from 'next/server';
import { BountyStore } from '@/lib/store';
import { addDays } from 'date-fns';

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

        if (bounty.claimingModel !== 'single-claim') {
            return NextResponse.json({ error: 'Invalid claiming model for this action' }, { status: 400 });
        }

        if (bounty.status !== 'open') {
            return NextResponse.json({ error: 'Bounty is not available' }, { status: 409 });
        }

        const now = new Date();
        const updates = {
            status: 'claimed' as const,
            claimedBy: contributorId,
            claimedAt: now.toISOString(),
            claimExpiresAt: addDays(now, 7).toISOString(), // Default 7 days
            updatedAt: now.toISOString()
        };

        const updatedBounty = BountyStore.updateBounty(bountyId, updates);

        return NextResponse.json({ success: true, data: updatedBounty });

    } catch (error) {
        console.error('Error claiming bounty:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
