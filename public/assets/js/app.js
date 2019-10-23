$(() => {
    /* signing up a user */
    authVerification();
    signup();
    login();
    createDesign();
    getAllDesigns();
    userDesign();
    designClick();
    detailsClick();
    loadDetails();
    loadDesignDetails()
    bookmarkClick();
    loadBookmark();
    editAndDeleteAction();
    logout();

    function authVerification(){
        if (localStorage.getItem("username") == null) {
            if (window.location.href != 'http://localhost:3000/index.html' && window.location.href != 'http://localhost:3000/signup.html' ) {
                window.location.href = 'index.html';
            } 
        }
    }

    function logout(){
        $('.logout').on('click', ()=>{
            localStorage.clear();
            window.location.href = 'index.html';
        })
      
    }

    function signup() {
        $("#sign-up").on('click', (e) => {
            e.preventDefault();
            var name = $("#name").val();
            var email = $("#email").val();
            var password = $("#pwd").val();
            var data = { name: name, email: email, password: password }
            if (name.length < 1 || email.length < 1 || password.length < 1) {
                $('.empty-data').show();
                return;
            }

            /* Query database to check existing email */
            $.ajax({
                url: "http://localhost:3000/users?email=" + email,
                type: "GET",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    console.log(result);

                    if (result.length > 0) {
                        $('.already-data').show();
                    } else {
                        $.ajax({
                            url: "http://localhost:3000/users",
                            data: JSON.stringify(data),
                            type: "POST",
                            contentType: "application/json",
                            error: (xhr, status, error) => {
                                alert(error)
                            },
                            success: (result, status, xhr) => {
                                window.location.href = "index.html";

                            }

                        });
                    }

                }

            });
        });
    }

    function login() {
        /* Log in check */
        $("#log-in").on('click', (e) => {
            e.preventDefault();
            var email = $("#email").val();
            var password = $("#pwd").val();
            var data = { name: name, email: email, password: password }

            if (email.length < 1 || password.length < 1) {
                $('.empty-data').show();
                return;
            }

            $.ajax({
                url: "http://localhost:3000/users?email=" + email,
                type: "GET",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    if (result.length > 0) {
                        if (password == result[0].password) {
                            window.location.href = "home.html";
                            localStorage.setItem("username", result[0].name);
                        } else {
                            $('.wrong-password').show();

                        }
                    } else {
                        $('.not-exist').show();
                    }

                }

            })
        });
    }


    function createDesign() {
       

        /* This replaces the value content */
        if (localStorage.getItem('Edit') == "edit") {
            $(".submit-design").text("Update")
            /* Get one particular design */
            $.ajax({
                url: "http://localhost:3000/designs/" + localStorage.getItem('designId'),
                type: "GET",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    $("#designName").val(result.designName);
                    $("#imgUrl").val(result.image);
                    $("#model").val(result.model);
                    $("#gender").val(result.gender);
                    $("#designType").val(result.designType);
                    $("#size").val(result.size);
                    $("#color").val(result.color);
                    $("#description").val(result.description);

                }


            });
            /* create Design */
            $(".submit-design").on('click', (e) => {
                e.preventDefault();
                var designName = $("#designName").val();
                var image = $("#imgUrl").val();
                var model = $("#model").val();
                var gender = $("#gender").val();
                var designType = $("#designType").val();
                var size = $("#size").val();
                var color = $("#color").val();
                var description = $("#description").val();
                var data = {
                    designName: designName, image: image, model: model, gender: gender,
                    designType: designType, size: size, color: color, description: description,
                    date: new Date(), poster: localStorage.getItem("username"), isBooked: false,
                    bookedBy: "None"
                }
                if (designName.length < 1 || image.length < 1 || model.length < 1 ||
                    gender.length < 1 || designType.length < 1 || size.length < 1 || color.length < 1 || description.length < 1) {
                    $('.empty-data').show();
                    return;
                }
                /* Update Design */
                $.ajax({
                    url: "http://localhost:3000/designs/" + localStorage.getItem('designId'),
                    data: JSON.stringify(data),
                    type: "PATCH",
                    contentType: "application/json",
                    error: (xhr, status, error) => {
                        alert(error)
                    },
                    success: (result, status, xhr) => {

                        $('.add-design').show();
                        $('#new-form').hide();

                    }

                });




            });
            /* Remove Edit for user */
            localStorage.removeItem("Edit");


        } else {
            /* Submitting a new design segment */
            $(".submit-design").on('click', (e) => {
                e.preventDefault();

                var designName = $("#designName").val();
                var image = $("#imgUrl").val();
                var model = $("#model").val();
                var gender = $("#gender").val();
                var designType = $("#designType").val();
                var size = $("#size").val();
                var color = $("#color").val();
                var description = $("#description").val();
                var data = {
                    designName: designName, image: image, model: model, gender: gender,
                    designType: designType, size: size, color: color, description: description,
                    date: new Date(), poster: localStorage.getItem("username"), isBooked: false,
                    bookedBy: "None"
                }
                if (designName.length < 1 || image.length < 1 || model.length < 1 ||
                    gender.length < 1 || designType.length < 1 || size.length < 1 || color.length < 1 || description.length < 1) {
                    $('.empty-data').show();
                    return;
                }
        

                $.ajax({
                    url: "http://localhost:3000/designs",
                    data: JSON.stringify(data),
                    type: "POST",
                    contentType: "application/json",
                    error: (xhr, status, error) => {
                        alert(error)
                    },
                    success: (result, status, xhr) => {

                        $('.add-design').show();
                        $('#new-form').hide();

                    }

                });




            });
        }
    }

    function getAllDesigns() {
        /* Getting all designs */
        $.ajax({
            url: "http://localhost:3000/designs",
            type: "GET",
            contentType: "application/json",
            success: (result, status, xhr) => {
                // console.log(result);
                let output = "";
                var div = $(".all-designs");
                for (i in result) {
                    output += ` <div class="col-md-4 detail-press" id="` + result[i].id + `">
            <div class="card" style="width:350px; border-radius: 20px; margin-bottom: 20px">
            <img class="card-img-top" style="border-radius:20px 20px 0px 0px" src="` + result[i].image + `"alt="Card image">
            <div class="card-body" style="padding-bottom: 0">
            <div class="row">
            <div class="col-md-8">
            <h4>` + result[i].designName + `</h4>
            </div>
            <div class="col-md-4">
            <p class="card-text pull-right">` + result[i].model + `</p>
            </div>
            </div>
            <hr style="margin: 5 0 5 0  !important ">
            <p class="card-text">`+ result[i].description + `</p>

            <p style="font-size: 12px; color: green;">Posted by `+ result[i].poster + `</p>
            </div>
            </div>
        </div> `;

                }
                div.append(output);

            }

        });
    }

    function userDesign() {
        /* Get designs posted ny user */
        let poster = localStorage.getItem("username");

        $.ajax({
            url: "http://localhost:3000/designs?poster=" + poster,
            type: "GET",
            contentType: "application/json",
            success: (result, status, xhr) => {

                let output = "";
                var div = $(".my-designs");
                for (i in result) {
                    output += ` <div class="col-md-4 card-press" id="` + result[i].id + `">
             <div class="card" style="width:350px; border-radius: 20px; margin-bottom: 20px">
             <img class="card-img-top" style="border-radius:20px 20px 0px 0px" src="` + result[i].image + `"alt="Card image">
             <div class="card-body" style="padding-bottom: 0">
             <div class="row">
             <div class="col-md-8">
             <h4>` + result[i].designName + `</h4>
             </div>
             <div class="col-md-4">
             <p class="card-text pull-right">` + result[i].model + `</p>
             </div>
             </div>
             <hr style="margin: 5 0 5 0  !important ">
             <p class="card-text">`+ result[i].description + `</p>

             <p style="font-size: 12px; color: green;">Posted by `+ result[i].poster + `</p>
             </div>
             </div>
         </div> `;

                }
                // if there is no design posted by designer
                if (result.length < 1) {
                    $('.no-design').show();
                } else {
                    div.append(output);
                }

            }

        });
    }
    function loadBookmark() {
        /* Get designs posted ny user */
        let poster = localStorage.getItem("username");

        $.ajax({
            url: "http://localhost:3000/designs?bookedBy=" + poster,
            type: "GET",
            contentType: "application/json",
            success: (result, status, xhr) => {

                let output = "";
                var div = $(".bookmark-designs");
                for (i in result) {
                    output += ` <div class="col-md-4 detail-press" id="` + result[i].id + `">
             <div class="card" style="width:350px; border-radius: 20px; margin-bottom: 20px">
             <img class="card-img-top" style="border-radius:20px 20px 0px 0px" src="` + result[i].image + `"alt="Card image">
             <div class="card-body" style="padding-bottom: 0">
             <div class="row">
             <div class="col-md-8">
             <h4>` + result[i].designName + `</h4>
             </div>
             <div class="col-md-4">
             <p class="card-text pull-right">` + result[i].model + `</p>
             </div>
             </div>
             <hr style="margin: 5 0 5 0  !important ">
             <p class="card-text">`+ result[i].description + `</p>

             <p style="font-size: 12px; color: green;">Posted by `+ result[i].poster + `</p>
             </div>
             </div>
         </div> `;

                }

                div.append(output);


            }

        });
    }
    function designClick() {
        $(document).on('click', '.card-press', function (e) {
            var id = $(e.target).parent().parent().attr('id');
            localStorage.setItem('designId', id);
            window.location.href = 'detail.html';

        });
    }
    function detailsClick() {
        $(document).on('click', '.detail-press', function (e) {
            var id = $(e.target).parent().parent().attr('id');
            localStorage.setItem('designId', id);
            window.location.href = 'design-details.html';

        });
    }

    function bookmarkClick() {

        $('.btn-bookmark').on('click', function (e) {
            e.preventDefault();
            var data = { isBooked: true, bookedBy: localStorage.getItem('username') }
            $.ajax({
                url: "http://localhost:3000/designs/" + localStorage.getItem('designId'),
                data: JSON.stringify(data),
                type: "PATCH",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    alert('Succesfully booked')

                }

            });





        });
    }

    function loadDetails() {

        if (window.location.href == 'http://localhost:3000/detail.html') {
            $.ajax({
                url: "http://localhost:3000/designs/" + localStorage.getItem('designId'),
                type: "GET",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    $('.design-image').attr('src', result.image);
                    $('.design-name').text(result.designName);
                    $('.design-model').append(result.model);
                    $('.design-size').append(result.size);
                    $('.design-color').append(result.color);
                    $('.design-gender').append(result.gender);
                    $('.design-type').append(result.designType);
                    $('.design-description').text(result.description);
                    $('.design-poster').append(result.poster);



                }

            });
        }
    }
    function loadDesignDetails() {

        if (window.location.href == 'http://localhost:3000/design-details.html') {
            $.ajax({
                url: "http://localhost:3000/designs/" + localStorage.getItem('designId'),
                type: "GET",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    $('.design-image').attr('src', result.image);
                    $('.design-name').text(result.designName);
                    $('.design-model').append(result.model);
                    $('.design-size').append(result.size);
                    $('.design-color').append(result.color);
                    $('.design-gender').append(result.gender);
                    $('.design-type').append(result.designType);
                    $('.design-description').text(result.description);
                    $('.design-poster').append(result.poster);



                }

            });
        }
    }

    function editAndDeleteAction() {
        $('.btn-edit').on('click', (e) => {
            e.preventDefault();
            localStorage.setItem("Edit", "edit");
            window.location.href = 'new-design.html';


        });

        $('.btn-delete').on('click', (e) => {
            e.preventDefault()
            $.ajax({
                url: "http://localhost:3000/designs/" + localStorage.getItem('designId'),
                type: "DELETE",
                contentType: "application/json",
                success: (result, status, xhr) => {
                    alert("design deleted successfully")
                    window.location.href = 'home.html';
                }

            });
        });

    }

    function AdminLogin(){
        
    }





});