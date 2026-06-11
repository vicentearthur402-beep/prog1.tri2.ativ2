class Item {
    constructor(public title: string) { }
}

class TodoList {
    private items: Promise<Item[]>;
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
        this.items = this.loadListFromDisk();
    }

    private async saveListToDisk() {
        const file = Bun.file(this.filePath);
        const data = JSON.stringify(await this.items);
        await file.write(data)
    }

    private async loadListFromDisk() {
        const file = Bun.file(this.filePath);
        const data = await file.json() as Item[];
        const items = data.map((v: any) => new Item(v.title));
        return items;
    }

    async addItem(item: Item) {
        const items = await this.items
        if (!item)
            throw "Item Inválido";
        if (!item.title.trim())
            throw "Item deve conter um título"
        items.push(item);
        await this.saveListToDisk();
    }

    async removeItem(index: number) {
        const items = await this.items;
        items.splice(index, 1);
        await this.saveListToDisk();
    }

    async updateItem(index: number, item: Item) {
        const items = await this.items;
        if (index < 0 || index >= items.length) {
            throw "índice inválido"
        }
        const oldItem = items[index];
        items[index] = item;
        await this.saveListToDisk();
        return oldItem
    }

    async getItems() {
        const items = await this.items;
        return Array.from(items);
    }

}


export default TodoList;
export { TodoList, Item }