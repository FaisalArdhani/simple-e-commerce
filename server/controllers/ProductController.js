import Product from "../models/ProductModel.js";

// method Get All
export const getProduct = async (req, res) => {
    try {
        const response = await Product.findAll();
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

// method Get By Id
export const getProductById = async (req, res) => {
    try {
        const response = await Product.findOne({
            where: { id: req.params.id }
        });
        res.status(200).json(response)
    } catch (error) {
        console.log(error.message)
    }
}

// method Post
export const createProduct = async (req, res) => {
    try {
        await Product.create(req.body);
        res.status(201).json({ msg: 'Product created' })
    } catch (error) {
        console.log(error.message)
    }
}

// method Patch
export const updateProduct = async (req, res) => {
    try {
        const [updatedRowsCount] = await Product.update(req.body, {
            where: { id: req.params.id }
        });

        if (updatedRowsCount > 0) {
            res.status(200).json({ msg: 'Product Updated Successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// method Delete
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
