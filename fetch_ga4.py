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
        # 1. User Behavior & Page Views
        request1 = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="pagePath")],
            metrics=[Metric(name="screenPageViews"), Metric(name="activeUsers"), Metric(name="bounceRate"), Metric(name="averageSessionDuration")],
            date_ranges=[DateRange(start_date="2026-07-29", end_date="today")],
        )
        response1 = client.run_report(request1)
        print("--- PAGE VIEWS & BEHAVIOR ---")
        for row in response1.rows:
            print(f"Path: {row.dimension_values[0].value}, Views: {row.metric_values[0].value}, Users: {row.metric_values[1].value}, Bounce: {row.metric_values[2].value}, Duration: {row.metric_values[3].value}")

        # 2. Traffic Sources
        request2 = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="sessionSourceMedium")],
            metrics=[Metric(name="sessions"), Metric(name="engagedSessions")],
            date_ranges=[DateRange(start_date="2026-07-29", end_date="today")],
        )
        response2 = client.run_report(request2)
        print("\n--- TRAFFIC SOURCES ---")
        for row in response2.rows:
            print(f"Source: {row.dimension_values[0].value}, Sessions: {row.metric_values[0].value}, Engaged: {row.metric_values[1].value}")

        # 3. Technical Issues (Errors/Crashes if tracked)
        request3 = RunReportRequest(
            property=f"properties/{property_id}",
            dimensions=[Dimension(name="eventName")],
            metrics=[Metric(name="eventCount")],
            date_ranges=[DateRange(start_date="2026-07-29", end_date="today")],
        )
        response3 = client.run_report(request3)
        print("\n--- EVENTS (Check for Errors) ---")
        for row in response3.rows:
            print(f"Event: {row.dimension_values[0].value}, Count: {row.metric_values[0].value}")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    fetch_data()
