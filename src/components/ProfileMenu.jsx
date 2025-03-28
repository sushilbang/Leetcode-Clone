import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext"; // Import useAuth to access user data

const ProfileMenu = () => {
  const { user, logout } = useAuth(); // Get user details and logout function

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='cursor-pointer'>
          <AvatarImage src={user?.photoURL || "https://github.com/shadcn.png"} alt="User Avatar" />
          <AvatarFallback>
            {user?.name ? user.name[0].toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent>
        <DropdownMenuLabel>{user?.name || "My Account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem as="a" href="/profile">Profile</DropdownMenuItem>
        <DropdownMenuItem as="a" href="/settings">Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={logout} 
          className="text-red-600 hover:bg-red-100 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileMenu;
