const Repository = ('../models/Repository');
module.exports = 
class BookmarksController extends require('./Controller') {
    constructor(req, res){
        super(req, res);        
        this.bookmarkRepository = new Repository('BooksMark');
    }

    get(id){
        //GET: 	/api/bookmarks/id
        if(!isNaN(id))
            this.response.JSON(this.bookmarkRepository.get(id));
        //GET: 	/api/bookmarks
        else
            this.response.JSON(this.bookmarkRepository.getAll());
    }

    post(bookmarks){  
        //POST: 	/api/bookmarks	Ajout d’un bookmark
        let newBookmark = this.bookmarkRepository.add(bookmarks);
        if (newBookmark)
            this.response.created(newBookmark);
        else
            this.response.internalError();
    }

    put(bookmarks){
        //PUT: 	/api/bookmarks/Id
        if (this.bookmarkRepository.update(bookmarks))
            this.response.ok();
        else 
            this.response.notFound();
    }

    remove(id){
        //DELETE: /api/bookmarks/Id
        if (this.bookmarkRepository.remove(id))
            this.response.accepted();
        else
            this.response.notFound();
    }

    getByName(nom){
        //GET: 	/api/bookmark?name="nom"
        this.response.JSON(this.bookmarkRepository.getByName(nom));
    }

    getByCategory(category){
        //GET: 	/api/bookmark?category="sport"
        this.response.JSON(this.bookmarkRepository.getByCategory(category));
    }

    help(){
        //GET: 	/api/bookmark?
        this.response.JSON(this.bookmarkRepository.help());
    }
}