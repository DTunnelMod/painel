class Category {
    constructor(id, name, color, status, sorter) {
        this.id = id;
        this.name = name;
        this.color = this.__parseColor(color);
        this.status = status;
        this.sorter = sorter;
    }

    __parseColor(color) {
        if (color.length === 7)
            color += 'FF';
        return color;
    }

    static fromJson(data) {
        return new Category(
            parseInt(data.id),
            data.name,
            data.color,
            data.status,
            parseInt(data.sorter),
        );
    }
}

export default Category