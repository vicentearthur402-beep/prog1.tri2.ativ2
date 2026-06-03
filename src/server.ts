// FALAR SOBRE API REST

const server = Bun.serve({
    port: 3000,
    routes: {
        "/api-debugger": Bun.file('public/api-debugger.html'),
        "/test": {
            GET: () => Response.json({ type: "GET", time: Date.now() }),
            PUT: () => Response.json({ type: "PUT", time: Date.now() }),
            POST: () => Response.json({ type: "POST", time: Date.now() }),
            DELETE: () => Response.json({ type: "DELETE", time: Date.now() }),
        }
    },
    fetch () {

        return new Response("Not Found", { status: 404})
    }
})

console.log(`⚡ http://localhost:${server.port}`)

