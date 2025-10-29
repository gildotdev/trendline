export async function onRequestGet(context) {
    const { searchParams } = new URL(context.request.url);
    const projectId = searchParams.get('id');
    
    if (!projectId) {
        return new Response(JSON.stringify({ error: 'Project ID required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const projectData = await context.env.TRENDLINE_KV.get(`project:${projectId}`);
        
        if (!projectData) {
            return new Response(JSON.stringify({ error: 'Project not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(projectData, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to load project' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    try {
        const projectData = await context.request.json();
        
        if (!projectData.projectId || !projectData.totalTasks || !projectData.startDate || !projectData.endDate) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Initialize dailyProgress if not present
        if (!projectData.dailyProgress) {
            projectData.dailyProgress = {};
        }
        
        // Store in KV
        await context.env.TRENDLINE_KV.put(
            `project:${projectData.projectId}`,
            JSON.stringify(projectData)
        );
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create project' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPut(context) {
    try {
        const updateData = await context.request.json();
        
        if (!updateData.projectId) {
            return new Response(JSON.stringify({ error: 'Project ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Load existing project
        const projectDataStr = await context.env.TRENDLINE_KV.get(`project:${updateData.projectId}`);
        
        if (!projectDataStr) {
            return new Response(JSON.stringify({ error: 'Project not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        const projectData = JSON.parse(projectDataStr);
        
        // Update only the fields that are provided
        if (updateData.projectName !== undefined) {
            projectData.projectName = updateData.projectName;
        }
        if (updateData.startDate !== undefined) {
            projectData.startDate = updateData.startDate;
        }
        if (updateData.endDate !== undefined) {
            projectData.endDate = updateData.endDate;
        }
        
        // Save back to KV
        await context.env.TRENDLINE_KV.put(
            `project:${updateData.projectId}`,
            JSON.stringify(projectData)
        );
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update project' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
