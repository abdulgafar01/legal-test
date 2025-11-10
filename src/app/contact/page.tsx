'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Loader2, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { contactFormSchema, ContactFormSchemaType } from '@/schemas/contactSchema';
import { submitContactForm } from '@/lib/api/contact';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';

const SUBJECT_OPTIONS = [
  { value: 'General Inquiry', label: 'General Inquiry' },
  { value: 'Technical Support', label: 'Technical Support' },
  { value: 'Legal Services Question', label: 'Legal Services Question' },
  { value: 'Billing & Payments', label: 'Billing & Payments' },
  { value: 'Report an Issue', label: 'Report an Issue' },
  { value: 'Partnership Opportunity', label: 'Partnership Opportunity' },
  { value: 'Other', label: 'Other' },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormSchemaType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      subject: '',
      message: '',
    },
  });

  const selectedSubject = watch('subject');

  const onSubmit = async (data: ContactFormSchemaType) => {
    setIsSubmitting(true);
    try {
      const response = await submitContactForm(data);
      
      if (response.success) {
        setIsSuccess(true);
        toast.success('Message sent successfully! 🎉', {
          description: "We'll get back to you as soon as possible.",
        });
        reset();
        
        // Reset success state after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error: any) {
      toast.error('Failed to send message', {
        description: error?.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header baseHref="/" />
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/" passHref>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Get in Touch 📬
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help! Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Email Us</h3>
                    <a href="mailto:support@legalai.com" className="text-blue-600 hover:underline text-sm">
                      support@legalai.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Call Us</h3>
                    <a href="tel:+1234567890" className="text-emerald-600 hover:underline text-sm">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Visit Us</h3>
                    <p className="text-slate-600 text-sm">
                      123 Legal Street<br />
                      Suite 456<br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Business Hours</h3>
                    <p className="text-slate-600 text-sm">
                      Monday - Friday<br />
                      9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-[var(--secondary)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-[var(--foreground)]">Quick Response Time ⚡</h3>
                <p className="text-sm text-slate-700">
                  Our support team typically responds within 24 hours during business days. For urgent matters, please call us directly.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-white border-b border-slate-200">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Send us a message
                </CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  Fill out the form below and we'll respond as soon as possible
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Message Sent Successfully! 🎉
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Thank you for contacting us. We'll get back to you shortly.
                    </p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline">
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name" className="text-slate-700">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register('name')}
                        className="mt-2"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-slate-700">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        {...register('email')}
                        className="mt-2"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label htmlFor="phone_number" className="text-slate-700">
                        Phone Number (Optional)
                      </Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        placeholder="+1 (234) 567-890"
                        {...register('phone_number')}
                        className="mt-2"
                      />
                      {errors.phone_number && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject" className="text-slate-700">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedSubject}
                        onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-slate-700">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        rows={6}
                        {...register('message')}
                        className="mt-2 resize-none"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                      )}
                      <p className="text-sm text-slate-500 mt-1">
                        Minimum 20 characters required
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-6 text-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle className="text-xl font-bold text-slate-900">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How quickly will I receive a response?</h3>
                <p className="text-slate-600 text-sm">
                  We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What information should I include?</h3>
                <p className="text-slate-600 text-sm">
                  Please provide as much detail as possible about your inquiry, including any relevant dates, reference numbers, or specific questions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Can I schedule a consultation?</h3>
                <p className="text-slate-600 text-sm">
                  Yes! You can book a consultation directly through our platform or mention it in your message and we'll help you schedule one.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Is my information secure?</h3>
                <p className="text-slate-600 text-sm">
                  Absolutely. We take data privacy seriously and all information submitted through this form is encrypted and handled securely.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
