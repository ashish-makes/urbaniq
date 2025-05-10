'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Loader2,
  Home,
  Building,
  Map,
  Globe,
} from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  image?: string;
  role: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchUserProfile();
    }
  }, [status, router]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) throw new Error('Failed to fetch profile');

      const data = await res.json();
      
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        postalCode: data.postalCode || '',
        country: data.country || '',
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to load your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      const updatedUser = await res.json();
      setProfile(updatedUser);
      
      // Update session data if name was changed
      if (session?.user && formData.name !== session.user.name) {
        await update({ name: formData.name });
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Function to get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Profile skeleton loader
  const ProfileSkeleton = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Name/Email/Phone/Country section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <div className="relative">
                <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full" /> {/* Icon */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            </div>
          ))}
        </div>
        
        {/* Address section */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" /> {/* Label */}
          <div className="relative">
            <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full" /> {/* Icon */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>
        </div>
        
        {/* City/State/Postal section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <div className="relative">
                <Skeleton className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full" /> {/* Icon */}
                <Skeleton className="h-10 w-full" /> {/* Input */}
              </div>
            </div>
          ))}
        </div>
        
        {/* Button */}
        <div className="mt-6">
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-xl font-medium mb-6">Profile Information</h1>
        <div className="bg-white p-6 rounded-md border border-gray-100 animate-pulse">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-xl font-medium mb-6">Profile Information</h1>
      
      <div className="bg-white p-6 rounded-md border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <Avatar className="h-14 w-14">
            <AvatarImage src={profile?.image || ''} alt={profile?.name || 'User'} />
            <AvatarFallback>{getUserInitials(profile?.name || '')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-medium">{profile?.name}</h2>
            <p className="text-sm text-gray-500">
              Member since {new Date(profile?.createdAt || '').toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleProfileUpdate}>
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                    className="pl-10"
                />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                    className="pl-10"
                />
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                    className="pl-10"
                />
                </div>
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="country"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                    className="pl-10"
                />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Street Address</Label>
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="address"
                name="address"
                placeholder="Your street address"
                value={formData.address}
                onChange={handleInputChange}
                  className="pl-10"
              />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <Label htmlFor="city">City</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="city"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                    className="pl-10"
                />
                </div>
              </div>
              
              <div>
                <Label htmlFor="state">State/Province</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="state"
                  name="state"
                  placeholder="State or province"
                  value={formData.state}
                  onChange={handleInputChange}
                    className="pl-10"
                />
                </div>
              </div>
              
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <div className="relative">
                  <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="Postal or ZIP code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                    className="pl-10"
                />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button className='rounded-full' type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 