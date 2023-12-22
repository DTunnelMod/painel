-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL COLLATE NOCASE,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL COLLATE NOCASE,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "sorter" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_configs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "auth_password" TEXT,
    "auth_username" TEXT,
    "auth_v2ray_uuid" TEXT,
    "category_id" INTEGER NOT NULL,
    "config_openvpn" TEXT,
    "config_payload_payload" TEXT,
    "config_payload_sni" TEXT,
    "config_v2ray" TEXT,
    "description" TEXT,
    "dns_server_dns1" TEXT,
    "dns_server_dns2" TEXT,
    "icon" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "proxy_host" TEXT,
    "proxy_port" INTEGER,
    "server_host" TEXT,
    "server_port" INTEGER,
    "sorter" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "tls_version" TEXT,
    "udp_ports" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "url_check_user" TEXT,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "app_configs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "app_configs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_texts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "app_texts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_layouts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "app_layouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_layout_storages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" TEXT,
    "app_layout_id" INTEGER NOT NULL,
    CONSTRAINT "app_layout_storages_app_layout_id_fkey" FOREIGN KEY ("app_layout_id") REFERENCES "app_layouts" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "app_configs_user_id_idx" ON "app_configs"("user_id");

-- CreateIndex
CREATE INDEX "app_texts_user_id_idx" ON "app_texts"("user_id");

-- CreateIndex
CREATE INDEX "app_layouts_user_id_idx" ON "app_layouts"("user_id");
