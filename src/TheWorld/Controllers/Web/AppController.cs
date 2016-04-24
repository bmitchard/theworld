using Microsoft.AspNet.Mvc;
using System;
using System.Linq;
using TheWorld.Services;
using TheWorld.ViewModels;
using TheWorld.Models;
using Microsoft.AspNet.Authorization;

namespace TheWorld.Controllers.Web
{
    public class AppController : Controller
    {
        private IMailService _mailService;
        private IWorldRepository _repository;

        public AppController(IMailService service, IWorldRepository repository)
        {
            _mailService = service;
            _repository = repository;
        }
        public IActionResult Index()
        {
           return View();
        }

        [Authorize]
        public IActionResult Trips()
        {
            var trips = _repository.GetAllTrips();

            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Contact(ContactViewModel model)
        {
            if (ModelState.IsValid)
            {
                var email = Startup.Configuration["AppSettings:SiteEmailAddress"];

                if (String.IsNullOrWhiteSpace(email))
                {
                    ModelState.AddModelError("", "Could not send email, configuraton problem.");
                }

                if (_mailService.SendMail(email,
                    email,
                    $"Contact Page from {model.Name} ({model.Email})",
                    model.Message))
                {
                    ModelState.Clear();

                    ViewBag.Message = "Mail Sent. Thanks!";

                }

            }

            return View();
        }
    }
}
