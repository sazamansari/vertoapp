'use client';

import { useState, useRef, useEffect } from 'react';
import { ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCurrent } from '@/features/auth/api/use-current';
import { useUpdateProfile } from '@/features/auth/api/use-update-profile';

interface EditProfileFormProps {
  onCancel?: () => void;
}

export const EditProfileForm = ({ onCancel }: EditProfileFormProps) => {
  const { data: user, isLoading: isLoadingUser } = useCurrent();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setImageUrl(user.imageUrl || '');
    }
  }, [user]);

  if (isLoadingUser) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-neutral-400" />
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        return toast.error('Please upload a valid image file (PNG/JPG/JPEG).');
      }
      if (file.size > 1 * 1024 * 1024) {
        return toast.error('Image size cannot exceed 1MB.');
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error('Name cannot be empty.');
    }

    updateProfile(
      {
        json: { name, imageUrl }
      },
      {
        onSuccess: () => {
          if (onCancel) onCancel();
        }
      }
    );
  };

  return (
    <Card className="size-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit Profile Settings</CardTitle>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isUpdating}
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <label className="text-sm font-medium">Profile Picture</label>
            <div className="flex items-center gap-x-5">
              {imageUrl ? (
                <div className="relative size-[72px] overflow-hidden rounded-full border border-neutral-200">
                  <Image
                    src={imageUrl}
                    alt="Profile Avatar"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <Avatar className="size-[72px]">
                  <AvatarFallback className="bg-neutral-100 flex items-center justify-center">
                    <ImageIcon className="size-[36px] text-neutral-400" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className="flex flex-col">
                <p className="text-sm font-semibold">User Photo</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, or JPEG, max 1MB</p>

                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept=".jpg, .png, .jpeg"
                  ref={inputRef}
                  disabled={isUpdating}
                />

                {imageUrl ? (
                  <Button
                    type="button"
                    disabled={isUpdating}
                    variant="destructive"
                    size="xs"
                    className="mt-2 w-fit"
                    onClick={() => {
                      setImageUrl('');
                      if (inputRef.current) inputRef.current.value = '';
                    }}
                  >
                    Remove Photo
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isUpdating}
                    variant="secondary"
                    size="xs"
                    className="mt-2 w-fit border border-neutral-300"
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload Photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DottedSeparator className="py-7" />

          <div className="flex items-center justify-between">
            <Button
              disabled={isUpdating}
              type="button"
              size="lg"
              variant="secondary"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button disabled={isUpdating} type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
