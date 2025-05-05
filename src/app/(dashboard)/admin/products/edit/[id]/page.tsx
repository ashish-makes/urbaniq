'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Upload, 
  Loader2,
  X,
  Plus,
  Trash,
  ArrowLeft,
  Tag,
  PenLine,
  Hash,
  TextQuote,
  Bookmark,
  Package,
  DollarSign,
  Palette,
  Settings,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import { optimizeImages } from '@/lib/image-optimization';

interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  category: string;
  imageFiles?: File[];
  images: string[];
  isBestseller: boolean;
  inStock: boolean;
  freeShipping: boolean;
  featured: boolean;
  features: string[];
  colors: string[];
  tags: string[];
  specs: Record<string, string>;
  slug: string;
}

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    longDescription: '',
    price: 0,
    originalPrice: null,
    stock: 0,
    category: '',
    images: [],
    imageFiles: [],
    isBestseller: false,
    inStock: true,
    freeShipping: false,
    featured: false,
    features: [''],
    colors: [''],
    tags: [''],
    specs: {} as Record<string, string>,
    slug: ''
  });

  // State for dynamic specs fields
  const [specFields, setSpecFields] = useState<{ key: string; value: string }[]>([
    { key: 'dimensions', value: '' },
    { key: 'weight', value: '' },
  ]);

  const categories = [
    'Furniture',
    'Lighting',
    'Decor',
    'Kitchen',
    'Bathroom',
    'Bedroom',
    'Office',
    'Outdoor',
    'Electronics',
    'Smartphone',
    'Smart Home',
    'Pet Supplies',
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/products?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const productData = await response.json();
        
        // Initialize spec fields from product data
        const specsArray = Object.entries(productData.specs || {}).map(
          ([key, value]) => ({ key, value: String(value) })
        );
        
        if (specsArray.length > 0) {
          setSpecFields(specsArray);
        }
        
        // Set existing images
        setExistingImages(productData.images || []);
        
        // Set form data
        setFormData({
          ...productData,
          imageFiles: [],
        });
        
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    setFormData({ ...formData, [fieldName]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Show loading toast
    const loadingToast = toast.loading('Processing images...');

    try {
      const newImageFiles = [...(formData.imageFiles || [])];
      const newPreviewImages = [...previewImages];

      // Create preview immediately for better UX
      Array.from(files).forEach(file => {
        // Check file type
        if (!file.type.match('image.*')) {
          toast.error(`${file.name} is not an image file`);
          return;
        }

        // Check file size (limit to 10MB for original)
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Image ${file.name} is larger than 10MB`);
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
          newPreviewImages.push(event.target?.result as string);
          setPreviewImages([...newPreviewImages]);
        };
        reader.readAsDataURL(file);

        // Add file to array (will be optimized before upload)
        newImageFiles.push(file);
      });

      setFormData({
        ...formData,
        imageFiles: newImageFiles
      });

      toast.dismiss(loadingToast);
      toast.success('Images added successfully');
    } catch (error) {
      console.error('Error processing images:', error);
      toast.dismiss(loadingToast);
      toast.error('Failed to process images');
    }
  };

  const removeNewImage = (index: number) => {
    const newPreviewImages = [...previewImages];
    const newImageFiles = [...(formData.imageFiles || [])];
    
    newPreviewImages.splice(index, 1);
    newImageFiles.splice(index, 1);
    
    setPreviewImages(newPreviewImages);
    setFormData({
      ...formData,
      imageFiles: newImageFiles
    });
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = [...existingImages];
    newExistingImages.splice(index, 1);
    setExistingImages(newExistingImages);
  };

  // Handle dynamic arrays (features, colors, tags)
  const handleArrayItemChange = (arrayName: 'features' | 'colors' | 'tags', index: number, value: string) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  const addArrayItem = (arrayName: 'features' | 'colors' | 'tags') => {
    const newArray = [...formData[arrayName], ''];
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  const removeArrayItem = (arrayName: 'features' | 'colors' | 'tags', index: number) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [arrayName]: newArray
    });
  };

  // Handle specs object
  const handleSpecChange = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specFields];
    newSpecs[index][field] = value;
    setSpecFields(newSpecs);
  };

  const addSpecField = () => {
    setSpecFields([...specFields, { key: '', value: '' }]);
  };

  const removeSpecField = (index: number) => {
    const newSpecs = [...specFields];
    newSpecs.splice(index, 1);
    setSpecFields(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    if (formData.stock === undefined || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      toast.error('Please enter a valid stock quantity');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (existingImages.length === 0 && (!formData.imageFiles || formData.imageFiles.length === 0)) {
      toast.error('Please upload at least one product image');
      return;
    }

    setIsSubmitting(true);
    let optimizedImages: File[] = [];

    // Format specs object
    const specs: Record<string, string> = {};
    specFields.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        specs[spec.key] = spec.value;
      }
    });

    try {
      // Optimize images if there are new ones
      if (formData.imageFiles && formData.imageFiles.length > 0) {
        const optimizationToast = toast.loading('Optimizing images...');
        optimizedImages = await optimizeImages(formData.imageFiles);
        toast.dismiss(optimizationToast);
      }
      
      // Create FormData object to send to the API
      const data = new FormData();
      data.append('id', formData.id);
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('longDescription', formData.longDescription || '');
      data.append('price', String(formData.price));
      
      if (formData.originalPrice) {
        data.append('originalPrice', String(formData.originalPrice));
      }
      
      data.append('stock', String(formData.stock));
      data.append('category', formData.category);
      
      // Add boolean values
      data.append('isBestseller', String(formData.isBestseller));
      data.append('inStock', String(formData.inStock));
      data.append('freeShipping', String(formData.freeShipping));
      data.append('featured', String(formData.featured));
      
      // Add arrays and objects as JSON strings
      data.append('features', JSON.stringify(formData.features.filter(f => f.trim() !== '')));
      data.append('colors', JSON.stringify(formData.colors.filter(c => c.trim() !== '')));
      data.append('tags', JSON.stringify(formData.tags.filter(t => t.trim() !== '')));
      data.append('specs', JSON.stringify(specs));
      
      // Add existing images
      data.append('existingImages', JSON.stringify(existingImages));
      
      // Append all optimized image files
      optimizedImages.forEach(file => {
        data.append('images', file);
      });

      const response = await fetch(`/api/admin/products?id=${formData.id}`, {
        method: 'PUT',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update product');
      }

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-gray-400" />
          <p>Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Basic Information Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Basic Information</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm">Product Name <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Bookmark className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm">Short Description <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <TextQuote className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter a brief product description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={2}
                      className="resize-none pl-10 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="longDescription" className="text-sm">Detailed Description</Label>
                  <div className="relative">
                    <PenLine className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="longDescription"
                      name="longDescription"
                      placeholder="Enter a detailed product description"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="resize-none pl-10 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="price" className="text-sm">Price ($) <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => handleNumberInputChange(e, 'price')}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="originalPrice" className="text-sm">Original Price ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.originalPrice || ''}
                        onChange={(e) => handleNumberInputChange(e, 'originalPrice')}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="stock" className="text-sm">Stock <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Package className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => handleNumberInputChange(e, 'stock')}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Product Features</h2>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        value={feature}
                        onChange={(e) => handleArrayItemChange('features', index, e.target.value)}
                        placeholder={`Feature ${index + 1}`}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeArrayItem('features', index)}
                      disabled={formData.features.length === 1}
                      className="h-8 w-8 p-0 text-gray-500 rounded-full"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('features')}
                  className="flex items-center text-xs h-7 rounded-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Feature
                </Button>
              </div>
            </div>

            {/* Specifications Section Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Technical Specifications</h2>
              <div className="space-y-2">
                {specFields.map((spec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="relative mb-1">
                        <Settings className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          value={spec.key}
                          onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                          placeholder="Specification name"
                          className="pl-10"
                        />
                      </div>
                      <div className="relative">
                        <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                          placeholder="Specification value"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSpecField(index)}
                      disabled={specFields.length === 1}
                      className="h-8 w-8 mt-1 p-0 text-gray-500 rounded-full"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecField}
                  className="flex items-center text-xs h-7 rounded-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Specification
                </Button>
              </div>
            </div>

            {/* Colors Section Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Available Colors</h2>
              <div className="space-y-2">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Palette className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        value={color}
                        onChange={(e) => handleArrayItemChange('colors', index, e.target.value)}
                        placeholder={`Color ${index + 1} (e.g. Black, White, etc.)`}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeArrayItem('colors', index)}
                      disabled={formData.colors.length === 1}
                      className="h-8 w-8 p-0 text-gray-500 rounded-full"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('colors')}
                  className="flex items-center text-xs h-7 rounded-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Color
                </Button>
              </div>
            </div>

            {/* Tags Section Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Product Tags</h2>
              <div className="space-y-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        value={tag}
                        onChange={(e) => handleArrayItemChange('tags', index, e.target.value)}
                        placeholder={`Tag ${index + 1}`}
                        className="pl-10"
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeArrayItem('tags', index)}
                      disabled={formData.tags.length === 1}
                      className="h-8 w-8 p-0 text-gray-500 rounded-full"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('tags')}
                  className="flex items-center text-xs h-7 rounded-full"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-4">
            {/* Category Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Category</h2>
              <div className="space-y-1">
                <Label htmlFor="category" className="text-sm">Select Category <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger id="category" className="border-input rounded-lg">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Status Card */}
            <div className="border bg-white p-4 rounded-lg">
              <h2 className="text-md font-medium mb-3">Product Status</h2>
              <div className="grid grid-cols-2 gap-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="inStock" 
                    checked={formData.inStock}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('inStock', checked as boolean)
                    }
                    className="rounded-md"
                  />
                  <label
                    htmlFor="inStock"
                    className="text-sm leading-none"
                  >
                    In Stock
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isBestseller" 
                    checked={formData.isBestseller}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('isBestseller', checked as boolean)
                    }
                    className="rounded-md"
                  />
                  <label
                    htmlFor="isBestseller"
                    className="text-sm leading-none"
                  >
                    Bestseller
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="freeShipping" 
                    checked={formData.freeShipping}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('freeShipping', checked as boolean)
                    }
                    className="rounded-md"
                  />
                  <label
                    htmlFor="freeShipping"
                    className="text-sm leading-none"
                  >
                    Free Shipping
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="featured" 
                    checked={formData.featured}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('featured', checked as boolean)
                    }
                    className="rounded-md"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm leading-none"
                  >
                    Featured
                  </label>
                </div>
              </div>
            </div>

            {/* Images Upload Card */}
            <div className="border rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-4 w-4 text-primary mr-2" />
                  <h3 className="text-sm font-medium">Product Images</h3>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start space-x-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p>Images will be automatically optimized before upload to improve performance and reduce bandwidth usage.</p>
                  <p className="mt-1">High-resolution images will be resized to a maximum of 1200px width/height and compressed to reduce file size.</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm">Current Images</Label>
                
                {existingImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative border p-1 rounded-lg">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white/80 text-gray-500 p-0"
                          onClick={() => removeExistingImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          className="h-24 w-full object-contain"
                          width={160}
                          height={160}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 mb-2">No existing images</div>
                )}
                
                <Label className="text-sm">Upload New Images</Label>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {previewImages.map((preview, index) => (
                    <div key={index} className="relative border p-1 rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white/80 text-gray-500 p-0"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="h-24 w-full object-contain"
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col items-center justify-center border border-dashed p-3 rounded-lg">
                  <Upload className="mb-1 h-5 w-5 text-gray-400" />
                  <p className="text-xs text-center text-gray-500">PNG, JPG or WEBP (max 10MB, will be optimized)</p>
                  <Label
                    htmlFor="image-upload"
                    className="mt-2 cursor-pointer rounded-full bg-primary px-3 py-1 text-xs text-white hover:bg-primary/90"
                  >
                    Add Images
                  </Label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImagesUpload}
                    className="hidden"
                    multiple
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
                disabled={isSubmitting}
                className="flex-1 h-9 rounded-full"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 h-9 rounded-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Product'
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 
 