import TodoListClass, { Item } from "./core"
const todolist = new TodoListClass("todolist.json")

function testRoute(req: Bun.BunRequest) {
    return Response.json({
        method: req.method,
        time: new Date().toLocaleString('pt-BR'),
        body: req.body?.text(),
        key: crypto.randomUUID()
    });
}

const server = Bun.serve({
    port: 3000,
    routes: {
        '/': (req) => new Response(Bun.file("./public/index.html")),
        '/api-debugger': (req) => new Response(Bun.file('./public/api-debugger.html')),
        '/test': testRoute,
        '/todo': {
            GET: async () => {
                const items = await todolist.getItems()
                return Response.json(items)
            },
            POST: async (req) => {
                let data

                try {
                    data = await req.body?.json();
                } catch (e) {
                    return new Response('Json do corpo mal formatado', { status: 400 })
                }
                if (!data?.title) {
                    return new Response('É preciso informar title', { status: 400 })
                }

                let index: number

                try {
                    index = await todolist.addItem(new Item(data.title))
                } catch (error) {
                    return new Response('Erro ao adicionar ITEM:', { status: 500 })
                }

                return Response.json({ index }, { status: 201 })
            }

        },
        '/todo/:index': {
            GET: (req) => {
                return new Response("Not Implemented Yet!", { status: 501 })
            },
            DELETE: async (req) => {
                const indexStr = req.params.index;
                const index = parseInt(indexStr)

                if (isNaN(index)) {
                    return new Response('Erro, precisa de um número', { status: 400 })
                }
                const items = todolist.removeItem(index);
                try {
                    await todolist.removeItem(index)
                    return new Response(`Item do index ${index} removido`)
                } catch (e) {
                    return new Response(`Item do index ${index} não existe `, { status: 400 })
                }
                return new Response(req.params.index)
            }
        }


    },
    fetch(req) {
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`⚡http://localhost:${server.port}`);