
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        objectsName = objectsName.toLowerCase();
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    //recherche un nom
    getByName(name){
        for(let obj of this.objectsList){
            if(this.objectsList.name === name)
                return obj;
        }
        return null;
    }
    //recherche toute par category
    getByCategory(category){
        let listeObjets = [];
        for(let object of this.objectsList){
            if (object.category === category) {
                listeObjets.push(object);
            }
        }
        return listeObjets;
    }
    //retourn les option possible pour bookmark
    help(){
        return  'Option'+
        'GET: 	/api/bookmarks				voir tous les bookmarks' +
        'GET: 	/api/bookmarks?sort="name"		voir tous les bookmarks triés ascendant par Name'+
        'GET: 	/api/bookmarks?sort="category"	voir tous les bookmarks triés descendant par Category'+
        'GET: 	/api/bookmarks/id			voir le bookmark Id'+
        'GET: 	/api/bookmark?name="nom"		voir le bookmark avec Name = nom'+
        'GET: 	/api/bookmark?name="ab*" 		voir tous les bookmarks avec Name commençant par ab'+
        'GET: 	/api/bookmark?category="sport"	voir tous les bookmarks avec Category = sport'+
        'GET: 	/api/bookmark?				Voir la liste des paramètres supportés'+
        'POST: 	/api/bookmarks				Ajout d’un bookmark (validez avant d’ajouter)'+
        'PUT: 	/api/bookmarks/Id			Modifier le bookmark Id (validez avant de modifier)'+
        'DELETE: /api/bookmarks/Id			Effacer le bookmark Id';
    }
    get(id){
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }
    remove(id) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    update(objectToModify) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
}