import { getWeighbridgeCollection } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const collection = await getWeighbridgeCollection();
    const record = await collection.findOne({ WBT_No: params.wbt });

    if (!record) {
      return Response.json(
        { success: false, error: 'Record not found' },
        { status: 404 }
      );
    }

    const enhancedRecord = {
      ...record,
      'Net Weight': (record.WBT_1_Gross - record.WBT_1_Tare) || 0
    };

    return Response.json({ success: true, data: enhancedRecord });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}