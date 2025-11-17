const fs = require('fs');
const path = require('path');

class DataStore {
  constructor(filename) {
    this.filepath = path.join(__dirname, '../data', filename);
  }

  read() {
    if (!fs.existsSync(this.filepath)) {
      return [];
    }
    const data = fs.readFileSync(this.filepath, 'utf8').trim();
    if (!data) {
      return [];
    }
    return data.split('\n').map(line => JSON.parse(line));
  }

  write(items) {
    const dir = path.dirname(this.filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const data = items.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(this.filepath, data);
  }

  findById(id) {
    const items = this.read();
    return items.find(item => item.id === id);
  }

  create(item) {
    const items = this.read();
    const newItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  update(id, updates) {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }
    items[index] = {
      ...items[index],
      ...updates,
      id: items[index].id,
      createdAt: items[index].createdAt,
      updatedAt: new Date().toISOString()
    };
    this.write(items);
    return items[index];
  }

  delete(id) {
    const items = this.read();
    const newItems = items.filter(item => item.id !== id);
    if (newItems.length === items.length) {
      return false;
    }
    this.write(newItems);
    return true;
  }

  filter(predicate) {
    const items = this.read();
    return items.filter(predicate);
  }

  paginate(page = 1, limit = 10, filter = {}) {
    let items = this.read();

    // Apply filters
    if (filter.search) {
      items = items.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(filter.search.toLowerCase())
        )
      );
    }

    Object.keys(filter).forEach(key => {
      if (key !== 'search' && filter[key] !== undefined) {
        items = items.filter(item => item[key] === filter[key]);
      }
    });

    // Sort
    if (filter.sortBy) {
      const sortOrder = filter.sortOrder === 'desc' ? -1 : 1;
      items.sort((a, b) => {
        if (a[filter.sortBy] < b[filter.sortBy]) return -1 * sortOrder;
        if (a[filter.sortBy] > b[filter.sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    const total = items.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedItems = items.slice(start, end);

    return {
      data: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

module.exports = DataStore;
