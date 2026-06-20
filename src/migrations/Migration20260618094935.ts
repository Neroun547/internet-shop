import { Migration } from '@mikro-orm/migrations';

export class Migration20260618094935 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table \`articles\` (\`id\` int unsigned not null auto_increment primary key, \`authors\` text not null, \`filename\` varchar(255) not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`name\` varchar(255) not null, \`theme\` varchar(255) not null, \`user_id\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`products\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`description\` text not null, \`price\` float null, \`available\` bool not null, \`type\` varchar(255) not null, \`num\` int not null, \`user_id\` int not null, \`rubric_id\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`orders\` (\`id\` int unsigned not null auto_increment primary key, \`product_id\` int unsigned null, \`count\` int not null, \`id_order\` varchar(255) not null, \`contact_info\` text not null, \`created_at\` datetime not null, \`remark\` text not null, \`status\` varchar(255) null, \`first_name\` varchar(255) not null, \`last_name\` varchar(255) not null, \`admin_note\` varchar(255) not null, \`user_id\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`products_images\` (\`id\` int unsigned not null auto_increment primary key, \`file_name\` varchar(255) not null, \`product_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`products_images\` add index \`products_images_product_id_index\` (\`product_id\`);`);

    this.addSql(`create table \`rubrics\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`selected_default\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`rubrics_types\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`rubric_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`rubrics_types\` add index \`rubrics_types_rubric_id_index\` (\`rubric_id\`);`);

    this.addSql(`create table \`settings\` (\`id\` int unsigned not null auto_increment primary key, \`setting_key\` varchar(255) not null, \`setting_value\` text not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`statistics\` (\`id\` int unsigned not null auto_increment primary key, \`user\` varchar(255) not null, \`date\` datetime not null, \`country_code\` tinytext not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`support_chat_messages\` (\`id\` int unsigned not null auto_increment primary key, \`message\` text not null, \`admin\` bool not null, \`chat\` int not null, \`date\` datetime not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`support_chat_users\` (\`id\` int unsigned not null auto_increment primary key, \`username\` varchar(255) not null, \`password\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`support_chats\` (\`id\` int unsigned not null auto_increment primary key, \`support_chat_user_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`support_chats\` add unique \`support_chats_support_chat_user_id_unique\` (\`support_chat_user_id\`);`);

    this.addSql(`create table \`translate\` (\`id\` int unsigned not null auto_increment primary key, \`key\` varchar(255) not null, \`iso_code\` varchar(255) not null, \`value\` text not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`users\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`password\` varchar(255) not null, \`role\` varchar(255) not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`video_photo_gallery\` (\`id\` int unsigned not null auto_increment primary key, \`name\` varchar(255) not null, \`theme\` varchar(255) not null, \`description\` varchar(255) not null, \`user_id\` int not null) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`video_photo_gallery_files\` (\`id\` int unsigned not null auto_increment primary key, \`file_name\` varchar(255) not null, \`video_photo_gallery_id\` int unsigned not null) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`video_photo_gallery_files\` add index \`video_photo_gallery_files_video_photo_gallery_id_index\` (\`video_photo_gallery_id\`);`);

    this.addSql(`alter table \`orders\` add constraint \`orders_product_id_foreign\` foreign key (\`product_id\`) references \`products\` (\`id\`) on delete set null;`);

    this.addSql(`alter table \`products_images\` add constraint \`products_images_product_id_foreign\` foreign key (\`product_id\`) references \`products\` (\`id\`);`);

    this.addSql(`alter table \`rubrics_types\` add constraint \`rubrics_types_rubric_id_foreign\` foreign key (\`rubric_id\`) references \`rubrics\` (\`id\`);`);

    this.addSql(`alter table \`support_chats\` add constraint \`support_chats_support_chat_user_id_foreign\` foreign key (\`support_chat_user_id\`) references \`support_chat_users\` (\`id\`);`);

    this.addSql(`alter table \`video_photo_gallery_files\` add constraint \`video_photo_gallery_files_video_photo_gallery_id_foreign\` foreign key (\`video_photo_gallery_id\`) references \`video_photo_gallery\` (\`id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`orders\` drop foreign key \`orders_product_id_foreign\`;`);
    this.addSql(`alter table \`products_images\` drop foreign key \`products_images_product_id_foreign\`;`);
    this.addSql(`alter table \`rubrics_types\` drop foreign key \`rubrics_types_rubric_id_foreign\`;`);
    this.addSql(`alter table \`support_chats\` drop foreign key \`support_chats_support_chat_user_id_foreign\`;`);
    this.addSql(`alter table \`video_photo_gallery_files\` drop foreign key \`video_photo_gallery_files_video_photo_gallery_id_foreign\`;`);

    this.addSql(`drop table if exists \`articles\`;`);
    this.addSql(`drop table if exists \`products\`;`);
    this.addSql(`drop table if exists \`orders\`;`);
    this.addSql(`drop table if exists \`products_images\`;`);
    this.addSql(`drop table if exists \`rubrics\`;`);
    this.addSql(`drop table if exists \`rubrics_types\`;`);
    this.addSql(`drop table if exists \`settings\`;`);
    this.addSql(`drop table if exists \`statistics\`;`);
    this.addSql(`drop table if exists \`support_chat_messages\`;`);
    this.addSql(`drop table if exists \`support_chat_users\`;`);
    this.addSql(`drop table if exists \`support_chats\`;`);
    this.addSql(`drop table if exists \`translate\`;`);
    this.addSql(`drop table if exists \`users\`;`);
    this.addSql(`drop table if exists \`video_photo_gallery\`;`);
    this.addSql(`drop table if exists \`video_photo_gallery_files\`;`);
  }

}
