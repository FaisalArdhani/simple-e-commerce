import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";

const { DataTypes } = Sequelize;

const Product = sequelize.define('product', {
    nama_produk: DataTypes.STRING,
    deskripsi: DataTypes.TEXT,
    harga: DataTypes.DECIMAL(10, 2),
    stok: DataTypes.INTEGER,
    kategori: DataTypes.STRING,
    gambar: DataTypes.STRING,
}, {
    freezeTableName: true
})

export default Product;

// (async () => {
//     await sequelize.sync();
// })();

