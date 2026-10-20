require('dotenv').config()
const { Sequelize, DataTypes, Model } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {

    },
})

class Blog extends Model { }
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
})

const main = async () => {
    try {
        const blog = await Blog.findAll()
        blog.forEach(b => {
            const { author, title, likes } = b.dataValues
            console.log(`${author}: ${title}, ${likes} likes`)
        })
        await sequelize.close()
    } catch (error) {
        console.log(error)
    }
}

main()