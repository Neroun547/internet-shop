import { Migration } from '@mikro-orm/migrations';

export class Migration20260619151301 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`alter table \`articles\` modify \`created_at\` varchar(255) not null;`);
    this.addSql(`alter table \`articles\` modify \`updated_at\` varchar(255) not null;`);

    this.addSql(`alter table \`products\` modify \`available\` bool not null;`);

    this.addSql(`alter table \`orders\` modify \`status\` varchar(255) null;`);

    this.addSql(`alter table \`support_chat_messages\` modify \`admin\` bool not null;`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table \`articles\` modify \`created_at\` datetime not null;`);
    this.addSql(`alter table \`articles\` modify \`updated_at\` datetime not null;`);

    this.addSql(`alter table \`orders\` modify \`status\` varchar(255) null default 'NULL';`);

    this.addSql(`alter table \`products\` modify \`available\` tinyint(1) not null;`);

    this.addSql(`alter table \`support_chat_messages\` modify \`admin\` tinyint(1) not null;`);
  }

}
