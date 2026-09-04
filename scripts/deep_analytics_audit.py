import os
import json
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Metric,
    RunReportRequest,
    OrderBy,
)

property_id = "521506803"
credentials_path = r"e:\projects\contest-tracker\contest-tracking-app-b7c7e27e370e.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path

client = BetaAnalyticsDataClient()

def run_query(dimensions, metrics, date_ranges, limit=25, order_by_metric=None, order_desc=True):
    order_bys = []
    if order_by_metric:
        order_bys = [OrderBy(metric=OrderBy.MetricOrderBy(metric_name=order_by_metric), desc=order_desc)]
    
    request = RunReportRequest(
        property=f"properties/{property_id}",
        dimensions=[Dimension(name=d) for d in dimensions],
        metrics=[Metric(name=m) for m in metrics],
        date_ranges=[DateRange(start_date=d[0], end_date=d[1]) for d in date_ranges],
        limit=limit,
        order_bys=order_bys
    )
    response = client.run_report(request)
    results = []
    for row in response.rows:
        dim_vals = [dv.value for dv in row.dimension_values]
        metric_vals = [mv.value for mv in row.metric_values]
        results.append({"dims": dim_vals, "metrics": metric_vals})
    return results

def main():
    print("=== GA4 COMPREHENSIVE ANALYTICS AUDIT ===")

    # 1. Macro Overview: 7d, 30d, 90d, All-time (365d)
    periods = [
        ("Last 7 Days", "7daysAgo", "today"),
        ("Last 30 Days", "30daysAgo", "today"),
        ("Last 90 Days", "90daysAgo", "today"),
        ("All Time (Last 365 Days)", "365daysAgo", "today"),
    ]
    
    overview_metrics = ["activeUsers", "newUsers", "sessions", "screenPageViews", "averageSessionDuration", "bounceRate"]
    
    print("\n--- 1. MACRO TRAFFIC OVERVIEW ---")
    for name, start, end in periods:
        res = run_query([], overview_metrics, [(start, end)])
        if res:
            m = res[0]["metrics"]
            dur = float(m[4]) if len(m) > 4 else 0
            bounce = float(m[5]) * 100 if len(m) > 5 else 0
            print(f"[{name}] Users: {m[0]} | New: {m[1]} | Sessions: {m[2]} | PageViews: {m[3]} | Avg Duration: {dur:.1f}s | Bounce: {bounce:.1f}%")

    # 2. Monthly Trend (last 12 months)
    print("\n--- 2. MONTHLY TRAFFIC TREND (Last 365 Days) ---")
    monthly = run_query(["yearMonth"], ["activeUsers", "sessions", "screenPageViews"], [("365daysAgo", "today")], limit=15)
    # sort by yearMonth ascending
    monthly.sort(key=lambda x: x["dims"][0])
    for row in monthly:
        print(f"Month {row['dims'][0]}: Users = {row['metrics'][0]}, Sessions = {row['metrics'][1]}, PageViews = {row['metrics'][2]}")

    # 3. Weekly Trend (last 8 weeks)
    print("\n--- 3. WEEKLY TRAFFIC TREND (Last 60 Days) ---")
    weekly = run_query(["isoYearIsoWeek"], ["activeUsers", "sessions", "screenPageViews"], [("60daysAgo", "today")], limit=12)
    weekly.sort(key=lambda x: x["dims"][0])
    for row in weekly:
        print(f"Week {row['dims'][0]}: Users = {row['metrics'][0]}, Sessions = {row['metrics'][1]}, PageViews = {row['metrics'][2]}")

    # 4. User Geography (Country) - Last 90 Days & Last 30 Days
    print("\n--- 4. USER GEOGRAPHY (Top Countries - Last 90 Days) ---")
    geo_countries = run_query(
        ["country"], 
        ["activeUsers", "sessions", "screenPageViews", "averageSessionDuration", "bounceRate"], 
        [("90daysAgo", "today")], 
        limit=20, 
        order_by_metric="activeUsers"
    )
    total_users_90 = sum(int(r["metrics"][0]) for r in geo_countries) or 1
    for row in geo_countries:
        c_users = int(row["metrics"][0])
        c_sess = int(row["metrics"][1])
        c_pv = int(row["metrics"][2])
        c_dur = float(row["metrics"][3])
        c_bounce = float(row["metrics"][4]) * 100
        pct = (c_users / total_users_90) * 100
        print(f"Country: {row['dims'][0]:<20} | Users: {c_users:>4} ({pct:>5.1f}%) | Sessions: {c_sess:>4} | PV: {c_pv:>4} | Avg Dur: {c_dur:>5.1f}s | Bounce: {c_bounce:>5.1f}%")

    # 5. Top Cities (Last 90 Days)
    print("\n--- 5. TOP CITIES (Last 90 Days) ---")
    cities = run_query(["city", "country"], ["activeUsers", "sessions"], [("90daysAgo", "today")], limit=15, order_by_metric="activeUsers")
    for row in cities:
        print(f"City: {row['dims'][0]:<20} ({row['dims'][1]:<12}) | Users: {row['metrics'][0]:>4} | Sessions: {row['metrics'][1]:>4}")

    # 6. Traffic Acquisition Channels (Last 90 Days)
    print("\n--- 6. TRAFFIC ACQUISITION CHANNELS (Last 90 Days) ---")
    channels = run_query(["sessionDefaultChannelGroup"], ["sessions", "activeUsers", "screenPageViews", "averageSessionDuration"], [("90daysAgo", "today")], limit=10, order_by_metric="sessions")
    for row in channels:
        print(f"Channel: {row['dims'][0]:<25} | Sessions: {row['metrics'][0]:>4} | Users: {row['metrics'][1]:>4} | PV: {row['metrics'][2]:>4} | Avg Dur: {float(row['metrics'][3]):>5.1f}s")

    # 7. Traffic Sources / Mediums
    print("\n--- 7. TOP TRAFFIC SOURCES / MEDIUMS (Last 90 Days) ---")
    sources = run_query(["sessionSource", "sessionMedium"], ["sessions", "activeUsers"], [("90daysAgo", "today")], limit=15, order_by_metric="sessions")
    for row in sources:
        print(f"Source/Medium: {row['dims'][0]} / {row['dims'][1]:<15} | Sessions: {row['metrics'][0]:>4} | Users: {row['metrics'][1]:>4}")

    # 8. Device & OS Breakdown
    print("\n--- 8. DEVICE CATEGORY & OS (Last 90 Days) ---")
    devices = run_query(["deviceCategory", "operatingSystem"], ["activeUsers", "sessions"], [("90daysAgo", "today")], limit=10, order_by_metric="sessions")
    for row in devices:
        print(f"Device: {row['dims'][0]:<10} | OS: {row['dims'][1]:<12} | Users: {row['metrics'][0]:>4} | Sessions: {row['metrics'][1]:>4}")

    # 9. Top 15 Pages (Last 90 Days)
    print("\n--- 9. TOP 15 PAGES BY VIEWS (Last 90 Days) ---")
    pages = run_query(["pagePath"], ["screenPageViews", "activeUsers", "averageSessionDuration", "bounceRate"], [("90daysAgo", "today")], limit=15, order_by_metric="screenPageViews")
    for row in pages:
        pv = int(row["metrics"][0])
        u = int(row["metrics"][1])
        dur = float(row["metrics"][2])
        bounce = float(row["metrics"][3]) * 100
        print(f"Page: {row['dims'][0]:<60} | Views: {pv:>4} | Users: {u:>4} | Avg Dur: {dur:>5.1f}s | Bounce: {bounce:>5.1f}%")

if __name__ == "__main__":
    main()
