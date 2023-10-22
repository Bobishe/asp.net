using Microsoft.AspNetCore.Mvc;
using System.Data;
using Dapper;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using MyWebApi;
namespace MyWebApi.Controllers



{

    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly IDbConnection _db;

        public ValuesController(IDbConnection db)
        {
            _db = db;
        }


        // Запрос на добавление нового товара
        [HttpPost("/admin/add")]
        public IActionResult AddFurniture([FromBody] Furniture furniture)
        {
            try
            {
                var query = @"INSERT INTO furniture (name, article, category, description, price, image) 
                      VALUES (@Name, @Article, @Category, @Description, @Price, @Image)";
                _db.Execute(query, furniture);

                return Ok(new { Message = "Furniture added successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while adding furniture: " + ex.Message });
            }
        }

        // Получение всех товаров из бд
        [HttpGet("/catalog")]
        public ActionResult<IEnumerable<Furniture>> GetCatalog()
        {
            try
            {
                var result = _db.Query<Furniture>("SELECT * FROM furniture");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving data from the database: " + ex.Message);
            }
        }


        // Получение новых товаров из бд
        [HttpGet("/")]
        public ActionResult<IEnumerable<string>> Get()
        {
            try
            {
                var result = _db.Query<Furniture>("SELECT * FROM furniture ORDER BY Id DESC LIMIT 8");
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving data from the database: " + ex.Message);
            }
        }


        // Получение записи из бд по id
        [HttpGet("/catalog/{id}")]
        public ActionResult<Furniture> GetFurniture(int id)
        {
            try
            {
                var result = _db.QueryFirstOrDefault<Furniture>("SELECT * FROM furniture WHERE Id = @Id", new { Id = id });
                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving data from the database: " + ex.Message);
            }
        }


        // Запрос на вторизацию
        [HttpPost("/login")]
        public IActionResult Login([FromBody] LoginModel loginModel)
        {
            string email = loginModel.email;
            string password = loginModel.password;

            // Проверка логина и пароля
            if (IsValidLogin(email, password))
            {

                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes("YbQ/zwmpY0M2NteaKpBnsLw8jzhN+AbAa6jkOCu0GHFgFsjQpq1e+HHoGSbYJtXM");
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                new Claim(ClaimTypes.Name, email)
                    }),
                    Expires = DateTime.UtcNow.AddDays(7), // Срок действия токена
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return Ok(new { Token = tokenHandler.WriteToken(token) });
            }
            else
            {
                var unauthorizedObjectResult = new UnauthorizedObjectResult(new { error = "Invalid username or password" });
                return unauthorizedObjectResult;
            }
        }


        // автаризация
        private bool IsValidLogin(string email, string password)
        {
            try
            {
                var user = _db.QueryFirstOrDefault<User>("SELECT * FROM user WHERE email = @Email AND pass = @Password",
                    new { Email = email, Password = password });

                return user != null;
            }
            catch (Exception ex)
            {
                Console.WriteLine("An error occurred while validating login: " + ex.Message);
                return false;
            }
        }


        // Удаление записи из бд по id
        [HttpDelete("/catalog/delete/{id}")]
        public IActionResult DeleteFurniture(int id)
        {
            try
            {
                var query = "DELETE FROM furniture WHERE Id = @Id";
                _db.Execute(query, new { Id = id });

                return Ok(new { Message = "Furniture deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while deleting furniture: " + ex.Message });
            }
        }

        // Изменение записи в бд по id
        [HttpPut("/catalog/save/{id}")]
        public IActionResult UpdateFurniture(int id, [FromBody] Furniture updatedFurniture)
        {
            try
            {
                updatedFurniture.Id = id;
                var query = @"UPDATE furniture SET name = @Name, article = @Article, category = @Category, 
                          description = @Description, price = @Price, image = @Image WHERE id = @Id";
                _db.Execute(query, updatedFurniture);

                return Ok(new { Message = "Furniture updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = "An error occurred while updating furniture: " + ex.Message });
            }
        }
    }
}
