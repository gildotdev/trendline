export async function onRequestPost(context) {
    try {
        const { projectId, date, tasksCompleted } = await context.request.json();
        
        if (!projectId || !date || tasksCompleted === undefined) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Load existing project
        const projectDataStr = await context.env.TRENDLINE_KV.get(`project:${projectId}`);
        
        if (!projectDataStr) {
            return new Response(JSON.stringify({ error: 'Project not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const projectData = JSON.parse(projectDataStr);
        
        // Update daily progress
        if (!projectData.dailyProgress) {
            projectData.dailyProgress = {};
        }
        projectData.dailyProgress[date] = tasksCompleted;
        
        // Save back to KV
        await context.env.TRENDLINE_KV.put(
            `project:${projectId}`,
            JSON.stringify(projectData)
        );
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update progress' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
