import {Pool} from "pg";
import {Observable} from "rxjs";
import uuid from "node-uuid";

//Postgress should handle uuid key generation and error handling for key collision.
//Then return the id to playlist model.This is async so model needs to sync up
// the correct key.

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
        this.newId = uuid.v1();// newId should be used to emit back to client
        return Observable.fromPromise(this._pool.query(`INSERT INTO 
            source(id, type, url, thumb, title, totalTime)
            VALUES( $1 , $2  ,$3 ,$4, $5, $6 )`,
            [this.newId,obj.type, obj.url, obj.thumb, obj.title, obj.totalTime]))
            .catch(e => {
                console.error(`PostgresPool : failed to get database: ${e.stack || e}`);
                return Observable.throw(e);
            })
            .do(console.log("PostgresPool : INSERT COMPLETE!"));
    }
    
    deleteRow$(obj){
        return Observable.fromPromise(this._pool.query(`DELETE FROM
            source WHERE id=$1`,[obj.id]))
            .catch(e => {
                console.error(`PostgresPool : failed to delete row ${obj.title}: ${e.stack || e}`);
                return Observable.throw(e);
            })
            .do(console.log("PostgresPool : DELETE ROW COMPLETE!"));
    }
    
}
/*
pool.connect()
    .then(client => client.query(`SELECT * FROM source`))
    .then(res => console.log(res));
*/