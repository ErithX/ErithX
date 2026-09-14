Your UI mapping is here ->

landing page -> src/pages/HomePage.tsx  -> landingPage.html theme
Dashboard page -> src/pages/DashboardPage.tsx -> userDashboard.html theme
resources page -> src/pages/ResourcePage.tsx -> resourcesPage.html theme
on clicking any blogs or items on resource page -> content.html [it will open up that specific resource with their id in url]

Convert same2Same html css to existing tailwind and next js 

Break Every component inside htmls as component .

Like , in resourcesPage.html , the cards are visible can be brokes into components so that we can change only card later . [/components/resourceCard.tsx] [/component/blogsCard.tsx]

In landing page , break down cards of DSA contests into components [/components/dsaContestCard.tsx]

