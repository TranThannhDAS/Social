﻿namespace QrCode_Chat_App.Models
{
    public class Role
    {
        public int Id { get; set; }
        public string Role_Name { get; set; }
        public ICollection<User> Users { get; set;}
    }
}