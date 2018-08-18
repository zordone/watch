const { Item } = require('./models');

// just for development
// eslint-disable-next-line no-unused-vars
exports.removeAllItems = () => {
    Item.remove({})
        .then(() => {
            console.log('[RemoveAllItems] All items removed.');
        })
        .catch(err => {
            console.error('[RemoveAllItems]', err);
        });
};

exports.listItems = (req, res) => {
    // removeAllItems(); // TODO :remove
    Item.find()
        .then(items => {
            console.log('[ListItems] Found:', items.length);
            res.send(items);
        })
        .catch(err => {
            console.error('[ListItems]', err);
            res.sendStatus(500);
        });
};

exports.newItem = (req, res) => {
    const body = (req && req.body) || {};
    const now = new Date();
    const model = new Item({
        title: body.title,
        type: body.type,
        created: now,
        updated: now
    });
    model.save((err, saved) => {
        if (err) {
            console.error('[NewItem] Item is not saved.', err);
            res.sendStatus(400);
        } else {
            console.log('[NewItem] Item is saved. ID:', saved.id);
            res.setHeader('Location', `/items/${saved.id}`);
            res.sendStatus(200);
        }
    });
};

exports.getItemById = (req, res) => {
    const { id } = req.params;
    Item.findById(id)
        .then(item => {
            if (!item) {
                console.log('[GetItemById] Not found.');
                res.sendStatus(404);
                return;
            }
            console.log('[GetItemById] Found.');
            res.send(item);
        })
        .catch(err => {
            console.error('[GetItemById]', err);
            res.sendStatus(500);
        });
};

exports.updateItemById = (req, res) => {
    const { id } = req.params;
    const body = (req && req.body) || {};
    // TODO: remove "readonly" fields, like _id, __v, created, updated, etc...
    body.updated = new Date();
    Item.findById(id)
        .then(item => {
            if (!item) {
                console.log('[UpdateItemById] Not found.');
                res.sendStatus(404);
                return;
            }
            console.log('[UpdateItemById] Found.');
            item.set(body);
            item.save((err, saved) => {
                if (err) {
                    console.error('[UpdateItemById] Item is not updated.', err);
                    res.sendStatus(400);
                } else {
                    console.log('[UpdateItemById] Item is updated.');
                    res.send(saved);
                }
            });
        })
        .catch(err => {
            console.error('[UpdateItemById]', err);
            res.sendStatus(500);
        });
};