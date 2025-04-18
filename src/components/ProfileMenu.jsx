import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";  

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer">
          <AvatarImage src={user?.photoURL || "https://github.com/shadcn.png"} alt="User Avatar" />
          <AvatarFallback>
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="left-0 -translate-x-6 translate-y-2">
        <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/problem-list")}>Problem List</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/submissions")}>Submissions</DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/profile")}>Profile</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => { logout(); navigate("/login"); }} 
          className="text-red-600 hover:bg-red-100 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
