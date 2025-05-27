import { getGRNCollection } from '@/lib/db';

export async function GET() {
  try {
    const collection = await getGRNCollection();
    const latestGRN = await collection.find().sort({ _id: -1 }).limit(1).toArray();
    
    return Response.json({ 
      success: true, 
      latestIndex: latestGRN.length ? latestGRN[0].grnNumber.slice(3) : '0'
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}