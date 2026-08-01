Version 3 is our main feature .Design a backend where


Students will upload their urls of various profiles like Github , Codeforces , Leetcode [mainly github / Leetcode mostly] ,

we fetch urls from DB -> Extract raw data s -> Strict rules filter [only real visible progress , Not historical data or number of problems solved , we reward consistency , Density of Progress & real growth] -> Send AI model -> get response -> send user

The response felt so real & unfiltered that a real Human reviewd trheir profile and honestly discuss growth or even downgrade , Also compares with previous results to celebrate achievemts if present or downgrade from previous weeks etc .

Business Plan :
|Feature|Free|Pro (Paid)|
|---|---|---|
|Profiles|2–3|Unlimited|
|Review frequency|Monthly|Weekly + on-demand|
|AI depth|Standard honest review|Deeper + personalized roadmap|
|Historical comparison|Last 1 review only|Full trend graphs + multi-week|
|Priority fetching|Normal queue|Priority queue|
|Contest trend analysis|Basic|Detailed + rating projection|
|Export / PDF report|No|Yes|
|Custom goals & reminders|No|Yes|
|Early access to new platforms|No|Yes|

We should use proper sheduler / worker for optimal operation [in email cronjobs also]

Platform aesthetics :

user will see a transperent highlevel input fields for input attachments , urls willl immediately verified when pasted [before submission] . And username will be extracted and shown on UI , All of this process will be done with a smal side loader .
invalid urls or urls that are not supported by platform will immediately rejected 

Our system should clearly list down every available public urls that can be used to execute this overall process ex: Github , Leetcode , CF . . . .

our bakcend should  not store users Overall data every time . 
┌─────────────────────────────────────────────────────────────┐
│                         USER                                 │
│              (LeetCode / GitHub / Codeforces)                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Profile URLs  │
                    │   stored in DB  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Fetch from API │  ← scheduled (daily/weekly)
                    │  (light calls)  │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Store RAW data  │ → Save to DB (with timestamp)
                    │   (snapshots)   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
   ┌────────────────────┐        ┌────────────────────┐
   │  Strict Progress   │        │  Strict Card Rules │
   │  Filter            │        │  (metric engine)   │
   │  (useful new data) │        │                    │
   └─────────┬──────────┘        └─────────┬──────────┘
             │                             │
             │                             ▼
             │                  ┌────────────────────┐
             │                  │  Card Generator    │
             │                  │  (5 card types)    │
             │                  │  → display cards   │
             │                  └────────────────────┘
             │
             ▼
   ┌────────────────────┐
   │  Rule Engine +     │
   │  AI / LLM          │ ←──┐
   │  (system prompt)   │    │  Comparison loop
   └─────────┬──────────┘    │  (current vs previous
             │               │   response / history)
             ▼               │
   ┌────────────────────┐    │
   │     Response       │────┘
   │  (honest review +  │
   │   comparison)      │
   └─────────┬──────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐   ┌──────────┐
│  Email   │   │ Store in │
│ (weekly) │   │    DB    │
└──────────┘   └──────────┘

          ┌────────────────────┐
          │   Analytics Page   │
          │ (overall data +    │
          │  trends + cards)   │
          └────────────────────┘