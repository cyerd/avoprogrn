import { getGRNCollection } from '@/lib/db';

export async function POST(request) {
  try {
    const collection = await getGRNCollection();
    const body = await request.json();
    
    // Generate GRN number (you might want to make this more sophisticated)
    const latestGRN = await collection.find().sort({ _id: -1 }).limit(1).toArray();
    const nextNumber = latestGRN.length ? parseInt(latestGRN[0].grnNumber.slice(3)) + 1 : 1;
    const grnNumber = `GRN${nextNumber.toString().padStart(4, '0')}`;

    await collection.insertOne({
      grnNumber,
      ...body,
      createdAt: new Date(),
      status: 'draft'
    });

    return Response.json({ success: true, grnNumber });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}