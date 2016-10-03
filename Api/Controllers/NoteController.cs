using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using PowerGrid.API.Models;

namespace PowerGrid.API.Controllers
{
    [Route("api/[controller]")]
    public class NoteController : Controller
    {
        private INoteRepository _repo;
        public NoteController(INoteRepository repo)
        {
            this._repo = repo;
        }

        [HttpGet]
        public IEnumerable<Note> GetAll()
        {
            return _repo.GetAll();
        }

        [HttpGet("{id}", Name = "GetNote")]
        public IActionResult GetById(string id)
        {
            var item = _repo.Find(id);
            if (item == null)
            {
                return NotFound();
            }
            return new ObjectResult(item);
        }

        [HttpPost]
        public IActionResult Create([FromBody] Note item)
        {
            if (item == null)
            {
                return BadRequest();
            }
            _repo.Add(item);
            return CreatedAtRoute("GetNote", new { controller = "Note", id = item.Key }, item);
        }

        [HttpDelete("{id}")]
        public void Delete(string id)
        {
            _repo.Remove(id);
        }
    }
}