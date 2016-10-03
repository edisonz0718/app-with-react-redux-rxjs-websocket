import {Pool} from "pg";
import {Observable} from "rxjs";

//const connectDB = Observable.bindNodeCallback(Pool.connect);
//const queryDB = Observable.bindNodeCallback(Client.query);


export class PostgresPool {
    constructor(config){
        this._config = config; 
        this._pool = new Pool(this._config);
        this._table = "source";// for fun only
    } 
    
    getAll$(){
        return Observable.fromPromise(this._pool.query(`SELECT * FROM source`)) 
            //.mergeMap(client => Observable.fromPromise(client.query(`SELECT * FROM source`)))
            //.mergeMap(query =>query(`SELCET * FROM source`))
            .catch(e => {
                console.error(`PostgresPool: failed to get database: ${e.stack || e}`);
                return Observable.throw(e);
            })
            //.filter(res => res.hasOwnProperty("rows"))
            //.do(res => console.log(res))
            .map(res => res.rows);
    }
    
    insertJSON$(obj){
        return Observable.fromPromise(this._pool.query(`INSERT INTO 
            source( type, url, thumb, title, totalTime)
            VALUES( $1 , $2  ,$3 ,$4, $5 )`,
            [obj.type, obj.url, obj.thumb, obj.title, obj.totalTime]))
            .catch(e => {
                console.error(`PostgresPool: failed to get database: ${e.stack || e}`);
                return Observable.throw(e);
            })
            .do(res => console.log(res));
    }
    
}
/*
pool.connect()
    .then(client => client.query(`SELECT * FROM source`))
    .then(res => console.log(res));
*/