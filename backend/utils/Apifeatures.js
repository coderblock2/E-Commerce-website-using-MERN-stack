// isme hmmlog search ke liye bnayenge ki kaise hmm aone product ko search kr skte hai ,, uske liye API create krenge ..
  // like -- http://localhost:3000/api/vi/prodicts?keyword=product1  --> then we got product1 details here we write code for get details by search name of that product..

   // yese code likhne se also suggested word bhi aa jaayegi  like : ifproductname is samosamosa but we search name only samosa then it also give as samosamosa because samosa contained in it ..
   // badi badi companyia me yesen hi hota like Amazon, flipcart..

  class Apifeatures {
    constructor(query, queryStr){
        this.query  = query;
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,   // regex is a mongodb operator .. regex means regular Expression  . Isme regex ka istemal hota hai jisse partial matches bhi ho sakein
                $options: "i"                  // small i means case-insensitive
            },
        } : {}

        // console.log(keyword);
           
        this.query = this.query.find({...keyword});
        return this;   // here we return same class itself.
    }

    filter(){
        const queryCopy = { ...this.queryStr };      

        //Removing some Fields for category
        const removeFields = ["keyword", "page", "limit"];   //This is because when query "keyword" will come then it must be the part of search(). abd when there is page then it must be a part of Pagination . and also same as limit ...  that's why we delete it from filter . if these words come then it is deleted and for rest word then we can filter on the basis of word ...
        removeFields.forEach((key) => delete queryCopy[key]);

        //Filter for Price and Rating    ..  isko filter krne ke liye hmm upper waale code ka use kr skte the but nhi kiye  hai kyunki jb hmm upper waale se search krenge to oo exact wala search krega ydi exact price mila to it rwturn otherwise it didn't return anything .... but in actual world, jb hmm ek koi price dete hai tb uske range ki saari products aa jaati hai ...  so we use this code for price filter and rating filter ..
        let queryStr = JSON.stringify(queryCopy);   // we use this for making String ony ...
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);   //gt-greater than , gte-greater than equal to  --> and same as lt and lte

        this.query = this.query.find(JSON.parse(queryStr));  // JSON.parse() se dubara objet bnn jaayega ...

        return this;
    }

    pagination(resultperpage){
        const currPage = Number(this.queryStr.page) || 1;

        const skip = resultperpage*(currPage-1);

        this.query = this.query.limit(resultperpage).skip(skip);

        return this;
    }

    // for price filtering, same code nhi likh skte hai .. because isme hmme price same dena padega ... jo ki userfriendly nhi hoga ...
       // hmme price ki filtering range me krni hai ya uske aas paas ka ...



}

module.exports = Apifeatures;