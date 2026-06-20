import { Migration } from '@mikro-orm/migrations';

export class Migration20260619220047 extends Migration {
  override isTransactional = () => false;

  override up(): void | Promise<void> {  
    this.addSql(`alter table \`support_chat_messages\` modify \`admin\` bool not null;`);

    this.addSql(`alter table \`products\` modify \`available\` bool not null;`);
    this.addSql(`alter table \`products\` modify \`user_id\` int unsigned not null;`);
    this.addSql(`alter table \`products\` add constraint \`products_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on delete cascade;`);
    this.addSql(`alter table \`products\` add index \`products_user_id_index\` (\`user_id\`);`);

    this.addSql(`alter table \`orders\` modify \`status\` varchar(255) null;`);
    this.addSql(`alter table \`orders\` modify \`user_id\` int unsigned not null;`);
    this.addSql(`alter table \`orders\` add constraint \`orders_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on delete cascade;`);
    this.addSql(`alter table \`orders\` add index \`orders_user_id_index\` (\`user_id\`);`);

    this.addSql(`alter table \`articles\` modify \`user_id\` int unsigned not null;`);
    this.addSql(`alter table \`articles\` add constraint \`articles_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on delete cascade;`);
    this.addSql(`alter table \`articles\` add index \`articles_user_id_index\` (\`user_id\`);`);

    this.addSql(`alter table \`video_photo_gallery\` modify \`user_id\` int unsigned not null;`);
    this.addSql(`alter table \`video_photo_gallery\` add constraint \`video_photo_gallery_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on delete cascade;`);
    this.addSql(`alter table \`video_photo_gallery\` add index \`video_photo_gallery_user_id_index\` (\`user_id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`articles\` drop foreign key \`articles_user_id_foreign\`;`);

    this.addSql(`alter table \`orders\` drop foreign key \`orders_user_id_foreign\`;`);

    this.addSql(`alter table \`products\` drop foreign key \`products_user_id_foreign\`;`);

    this.addSql(`alter table \`video_photo_gallery\` drop foreign key \`video_photo_gallery_user_id_foreign\`;`);

    this.addSql(`alter table \`articles\` drop index \`articles_user_id_index\`;`);
    this.addSql(`alter table \`articles\` modify \`user_id\` int not null;`);

    this.addSql(`alter table \`orders\` drop index \`orders_user_id_index\`;`);
    this.addSql(`alter table \`orders\` modify \`status\` varchar(255) null default 'NULL';`);
    this.addSql(`alter table \`orders\` modify \`user_id\` int not null;`);

    this.addSql(`alter table \`products\` drop index \`products_user_id_index\`;`);
    this.addSql(`alter table \`products\` modify \`available\` tinyint(1) not null;`);
    this.addSql(`alter table \`products\` modify \`user_id\` int not null;`);

    this.addSql(`alter table \`support_chat_messages\` modify \`admin\` tinyint(1) not null;`);

    this.addSql(`alter table \`video_photo_gallery\` drop index \`video_photo_gallery_user_id_index\`;`);
    this.addSql(`alter table \`video_photo_gallery\` modify \`user_id\` int not null;`);
  }

}
