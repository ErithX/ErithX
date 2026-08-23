wee need final testing .
for this I need to test both reliability + accuracy .
first accuracy :
I will create multiple fake accunts with fake progress .

## Stage 1 testing - Given different accounts each got one run , varry roy_factor , progress by given direction .

Create 6–8 test accounts with different situations:Test Profile
Situation
Purpose
Profile A
Strong progress
Check positive/encouraging tone
Profile B
No progress / zero activity
Check how it handles stagnation
Profile C
Only Easy problems
Comfort zone detection
Profile D
Ignored previous advice (roy_factor rising)
Progressive strictness test
Profile E
Good GitHub + weak contests
Mixed performance
Profile F
Sudden improvement after bad weeks
Recovery detection
Profile G
Very active but random topics
Focus & recommendation quality

Feed different weekly data to each profile.This solves the “same response” problem.
Manually create week-by-week snapshots:Week 1 data
Week 2 data (change numbers)
Week 3 data (make them follow or ignore advice)

** Concern me for extra datas - 
  Admin Note : I will manually write my notes for some users 
  Previous LLM response : Take care , dont feed your invented response . Yess we feed fake response but smartly - like how real LLM actually provides this field to feed (word count / etc) - verdict , we cant feed just 3 word sentence while in reality we are feeding xyz numbers of words in a decent tone

Focus on these:Does it correctly detect comfort zone?
Does it reference previous_recommendation properly?
Does roy_factor increase correctly when advice is ignored?
Is the tone soft when needed and stricter when roy_factor rises?
Does it avoid banned words and robotic language?
Is the output readable (not wall of text)?
Edge cases: zero activity, only GitHub activity, rating drop, etc.


#### Store every response , in this file , not DB . Or if needed create new file to store . I will see every responses 
