module.exports = class UserDto {
    login;
    id;
    status;
    first_name;
    last_name;
    email;
    phone;
    region;
    account_create_date;
    avatar_path;
    account_rating;
    account_rating_count;
    is_activated;

    constructor(model){
        this.login = model.login;
        this.id = model.id;
        this.status = model.status;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.email = model.email;
        this.phone = model.phone;
        this.region = model.region;
        this.account_create_date = model.account_create_date;
        this.avatar_path = model.avatar_path;
        this.account_rating = model.account_rating;
        this.account_rating_count = model.account_rating_count;
        this.is_activated = model.is_activated;
    }
}