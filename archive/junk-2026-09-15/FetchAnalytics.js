const { BetaAnalyticsDataClient } = require('@google-analytics/data');

// Replace with your actual GA4 Property ID (Found in GA Admin > Property Settings)
const propertyId = 'YOUR_GA4_PROPERTY_ID'; 

// Initialize client
const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport() {
  console.log('Fetching analytics data...');
  
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: 'yesterday', // e.g., 'yesterday', 'today', '7daysAgo'
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
        {
          name: 'sessionSource', // Where traffic came from (e.g., twitter, linkedin, direct)
        }
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
        {
          name: 'screenPageViews',
        },
      ],
    });

    console.log('\n--- Traffic Results ---');
    if (!response.rows || response.rows.length === 0) {
      console.log('No data found for the given date range.');
      return;
    }

    response.rows.forEach(row => {
      console.log(`Date: ${row.dimensionValues[0].value} | Source: ${row.dimensionValues[1].value}`);
      console.log(` -> Users: ${row.metricValues[0].value}, Page Views: ${row.metricValues[1].value}\n`);
    });

  } catch (error) {
    console.error('Error fetching analytics:', error.message);
  }
}

// Uncomment to run:
// runReport();
