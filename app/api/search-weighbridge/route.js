import { getWeighbridgeCollection } from "@/lib/db";


export async function GET(request) {
  try {
    const collection = await getWeighbridgeCollection();
    const { searchParams } = new URL(request.url);
    
    // Build query
    const query = {};
    const search = searchParams.get('search');
    if (search) {
      query.$or = [
        { SUP_Name: new RegExp(search, 'i') },
        { WBT_Veh_Reg: new RegExp(search, 'i') },
        { ItemName: new RegExp(search, 'i') },
        { DriverName: new RegExp(search, 'i') },
        { WBT_No: new RegExp(search, 'i') }
      ];
    }

    // Date filtering
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate || endDate) {
      query.WBT_Date = {};
      if (startDate) query.WBT_Date.$gte = new Date(`${startDate}T00:00:00Z`);
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999);
        query.WBT_Date.$lte = end;
      }
    }

    // Sorting
    const sortColumn = searchParams.get('sortColumn') || 'WBT_Date';
    const sortDirection = searchParams.get('sortDirection') === 'asc' ? 1 : -1;
    const sort = { [sortColumn]: sortDirection };

    const data = await collection.find(query).sort(sort).toArray();
    const enhancedData = data.map(item => ({
      ...item,
      'Net Weight': (item.Net_Weight ) || 0
    }));

    return Response.json({ success: true, data: enhancedData });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}