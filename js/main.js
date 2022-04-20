const signup = document.querySelector(".signup");
const form = document.querySelector(".modal");
const showNotification = () => {
  form.classList.add("open");
};

const saveData = () => {
  const err = document.querySelector(".error");
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var psw = document.getElementById("psw").value;
  var confirm = document.getElementById("confirm").value;
  const userData = JSON.parse(localStorage.getItem("users"));
  var user = [];
  user = userData ? userData : [];
  const checkEmail = user.find((el) => el.email === email);
  const checkUsername = user.find((el) => el.name === name);
  if (name == "" || email == "" || psw == "" || confirm == "") {
    err.innerHTML = "Vui long nhap het tat ca cac truong";
    return false;
  }
  if (checkEmail || checkUsername) {
    err.innerHTML = "Ten dang nhap hoac email da ton tai";
  } else {
    user.push({
      name: name,
      email: email,
      password: psw,
      confirm: confirm,
    });
    localStorage.setItem("users", JSON.stringify(user));
    document.getElementById("form-signUp").reset();
    signup.addEventListener("click", showNotification());
    setTimeout(() => {
      window.location.href = "login.html";
    }, 2000);
  }
};

//contructor Validator
function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};
  //validate
  function validate(inputElement, rule) {
    var errorMessage;
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);
    //get rule of selector
    var rules = selectorRules[rule.selector];
    //loop rule and check
    // if error stop
    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );
          break;
        default:
          errorMessage = rules[i](inputElement.value);
      }
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = " ";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }
  // get element of form validate
  var formElement = document.querySelector(options.form);
  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      //loop rules and validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          var enableInput = formElement.querySelectorAll("[name]");
          var formValues = Array.from(enableInput).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
                break;
              case "checkbox":
                if (input.matches(":checked")) {
                  if (!Array.isArray(values[input.name])) {
                    values[input.name] = [];
                  }
                  values[input.name].push(input.value);
                } else if (!values[input.name]) {
                  values[input.name] = "";
                }
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }
            return values;
          },
          {});
          options.onSubmit(formValues);
        } else {
          formElement.submit();
        }
      }
    };
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }
      var inputElements = formElement.querySelectorAll(rule.selector);

      Array.from(inputElements).forEach(function (inputElement) {
        //blur out tag input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // user input
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            options.formGroupSelector
          ).querySelector(options.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, options.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    });
  }
}

//define rules
// rules:
// 1. error => return message error
// 2. not error => return undifine
Validator.isRequired = function (selector, message) {
  return {
    selector,
    test: function (value) {
      return value ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là Email";
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};

$(document).ready(() => {
  const productData = JSON.parse(localStorage.getItem('product'))
  console.log(productData)
  $("#btn-search").click(() => {
    const name = $("#search-text").val();
    if (name.trim() === "") {
      $(".announcement").html("");
      productData.forEach((el) => {
        display(el);
      });
    }
  });
});
