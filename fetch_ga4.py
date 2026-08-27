import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
)

property_id = "521506803"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"e:\projects\contest-tracker\contest-tracking-app-b7c7e27e370e.json"

client = BetaAnalyticsDataClient()

def fetch_data():
    try:
        print("--- LAST 7 DAYS: PAGE PERFORMANCE ---")
        request1 = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="pagePath")],
            metrics=[Metric(name="screenPageViews"), Metric(name="activeUsers"), Metric(name="bounceRate"), Metric(name="averageSessionDuration")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        response1 = client.run_report(request1)
        
        # Sort by bounce rate descending to find broken pages
        rows = sorted(response1.rows, key=lambda r: float(r.metric_values[2].value), reverse=True)
        
        for row in rows:
            path = row.dimension_values[0].value
            views = int(row.metric_values[0].value)
            users = int(row.metric_values[1].value)
            bounce = float(row.metric_values[2].value)
            duration = float(row.metric_values[3].value)
            
            # Print all pages to see the breakdown, highlighting broken ones (100% bounce or 0 duration)
            if bounce >= 0.8 or duration < 5:
                print(f"[BROKEN] {path} (Views: {views}, Users: {users}, Bounce: {bounce*100:.1f}%, Duration: {duration:.1f}s)")
            else:
                print(f"[OK] {path} (Views: {views}, Users: {users}, Bounce: {bounce*100:.1f}%, Duration: {duration:.1f}s)")

        print("\n--- LAST 7 DAYS: ERROR EVENTS ---")
        request2 = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            date_ranges=[DateRange(start_date="7daysAgo", end_date="today")],
        )
        response2 = client.run_report(request2)
        for row in response2.rows:
            event = row.dimension_values[0].value
            count = row.metric_values[0].value
            if "error" in event.lower() or "exception" in event.lower() or "crash" in event.lower():
                print(f"[ERROR EVENT] {event} (Count: {count})")
            else:
                # Just print regular events to verify data exists
                print(f"Normal Event: {event} (Count: {count})")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    fetch_data()
