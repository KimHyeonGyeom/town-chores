import sequelize from "../lib/database.js";
import User from "./entities/user.model.js";
import Post from "./entities/post.model.js";
import Image from "./entities/image.model.js";
import Comment from "./entities/comment.model.js";
import Hashtag from "./entities/hashtag.model.js";
import Blame from "./entities/blame.model.js";
import Push from "./entities/push.model.js";
import Like from "./entities/like.model.js";


sequelize.define("users", User, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
            delete record.dataValues.social_id;
            delete record.dataValues.social_type;
        },
    }
});
sequelize.define("posts", Post, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    indexes: [{type: 'FULLTEXT', name: 'text_idx', fields: ['title', 'content']}],
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        }
    }
});
sequelize.define("images", Image, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        },
    }
});
sequelize.define("hashtags", Hashtag, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        },
    }
});
sequelize.define("comments", Comment, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        },
    }
});
sequelize.define("blames", Blame, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        },
    }
});
sequelize.define("pushes", Push, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        },
    }
});
sequelize.define("likes", Like, {
    freezeTableName: true,
    paranoid: true,
    underscored: true,
    timestamps: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
    hooks: {
        afterCreate: (record) => {
            delete record.dataValues.createdAt;
            delete record.dataValues.deletedAt;
            delete record.dataValues.updatedAt;
        },
    }
});


sequelize.models.posts.hasMany(sequelize.models.images,{foreignKey:'post_id',sourceKey :'id'});
sequelize.models.posts.hasMany(sequelize.models.hashtags,{foreignKey:'post_id',sourceKey :'id'});
sequelize.models.posts.hasOne(sequelize.models.users,{ foreignKey: 'id',sourceKey :'user_id' });
sequelize.models.comments.hasOne(sequelize.models.users,{ foreignKey: 'id',sourceKey :'user_id' });

//sequelize.models.images.belongsTo(MdPost,{foreignKey:'id',targetKey:'id'})
export default sequelize;