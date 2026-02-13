const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },

        password: {
            type: String,
            required: function () {
                return this.role === "SUPER_ADMIN";
            },
            select: false,
        },

        role: {
            type: String,
            enum: ["SUPER_ADMIN", "ADMIN"],
            default: "ADMIN",
        },

        adminKey: {
            type: String,
            unique: true,
            sparse: true,
        },

        lastUsedAt: {
            type: Date,
        },

        lastUsedIP: {
            type: String,
        },

        lastUsedDomain: {
            type: String,
        },

        lastUserAgent: {
            type: String,
        },


        status: {
            type: String,
            enum: ["ACTIVE", "BLOCKED"],
            default: "BLOCKED",
        },
    },
    { timestamps: true }
);

// ✅ THIS MUST BE EXACT
module.exports = mongoose.model("Admin", adminSchema);
