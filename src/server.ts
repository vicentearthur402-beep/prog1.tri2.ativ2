import TodoListClass, { Item } from "./core"
const todolist = new TodoListClass("todolist.json")

async function testRoute(req: Bun.BunRequest) {
  return Response.json({
    method: req.method,
    time: new Date().toLocaleString('pt-BR'),
    body: await req.body?.text(),
    key: crypto.randomUUID()
  });
}

const server = Bun.serve({
  port: 3000,
  routes: {
    '/': (req) => new Response(Bun.file('./public/index.html')),
    '/api-debugger': (req) => new Response(Bun.file('./public/api-debugger.html')),
    '/test':  testRoute,
    '/todo': {
      GET: async () => {
        const items = await todolist.getItems()
        return Response.json(items)
      },

      POST: async (req) => {
        let data
  
        try {
          data = await req.body?.json()
        } catch(e) {
          return new Response('json inválido', { status: 400 })
        }

        if (!data?.title) 
          return new Response('É preciso informar title', { status: 400 })

        let index: number

        try {
          index = await todolist.addItem(new Item(data.title))
        } catch (error) {
          return new Response('Erro ao adicionar item', { status: 500 })
        }

        return Response.json({ index }, { status: 201 })
      }
    },
    '/todo/:index': {
      GET: (req) => {
        return new Response("Not implemented yet!", { status: 501 })
      },
      DELETE: async (req) => {
        const strIndex = req.params.index
        const index = parseInt(strIndex)
        if (isNaN(index)) 
          return new Response('/todo/:index index precisa ser um número inteiro', { status: 400 })
        try {
          await todolist.removeItem(index)
          return new Response(`Item do index ${index} removido.`)
        } catch(e) {
          return new Response(`Item do index ${index} não existe.`, { status: 400 })
        }
      },
                   PUT : async (req) => {
                let data
                const indexStr = req.params.index;
                const index = parseInt(indexStr);

                if (isNaN(index)) {
                return new Response('Erro, precisa de um número', { status: 400 })
                }

                try {
                    data = await req.body?.json();
                } catch (e) {
                    return new Response('Json do corpo mal formatado', { status: 400 })
                }
                if (!data?.title) {
                    return new Response('É preciso informar title', { status: 400 })
                }
                
                try {
                await todolist.updateItem(index, new Item(data.title));
                } catch (e) {
                    return new Response('Erro ao adicionar ITEM:', { status: 500 })
                }
                    return new Response("Atualizado com sucesso");
            }
    }
  },
  fetch(req) {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Server running at http://localhost:${server.port}`);