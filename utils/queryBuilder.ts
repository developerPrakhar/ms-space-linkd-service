interface BuiltQuery {
 sql: string;
 args: any[];
}


export class QueryBuilder {
 private queryParts: string[] = [];
 private args: any[] = [];


 constructor(initialSql: string = '', initialArgs: any[] = []) {
   if (initialSql) this.append(initialSql, initialArgs);
 }
 append(sql: string, args: any[] = []): this {
   this.queryParts.push(sql), this.args.push(...args);
   return this;
 }


 appendPlaceHolders(count: number): this {
   if (count <= 0) {
     throw new Error(`count must be positive, but was: ${count}`);
   }
   const placeholders = new Array(count).fill('?').join(',');
   this.queryParts.push(placeholders);
   return this;
 }


 isEmpty(): boolean {
   return this.queryParts.length === 0;
 }


 hasArguments(): boolean {
   return this.args.length > 0;
 }


 build(): BuiltQuery {
   if (this.isEmpty()) {
     throw new Error('empty query');
   }
   let sql = this.queryParts.join(' ');
   const placeholdersCount = (sql.match(/\?/g) || []).length;
   if (placeholdersCount !== this.args.length) {
     throw new Error('Mismatch between placeholders and arguments');
   }
   return {
     sql,
     args: [...this.args],
   };
 }
}



