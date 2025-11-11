'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft, Mail, Phone, MapPin, Clock, Loader2, Send, CheckCircle
} from 'lucide-react';
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
import { useTranslations } from 'next-intl';

const SUBJECT_OPTIONS = [
  'generalInquiry',
  'technicalSupport',
  'legalServicesQuestion',
  'billingPayments',
  'reportIssue',
  'partnershipOpportunity',
  'other',
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations('contact');

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
        toast.success(t('toast.success.title'), {
          description: t('toast.success.description'),
        });
        reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error: any) {
      toast.error(t('toast.error.title'), {
        description: t('toast.error.description'),
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
            <Button variant="ghost" size="sm" className="gap-2" dir='ltr'>
              <ArrowLeft className="w-4 h-4" />
              {t('backToHome')}
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir='ltr'>
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{t('emailUs.title')}</h3>
                    <a href="mailto:admin@theyas.co" className="text-blue-600 hover:underline text-sm">
                      {t('emailUs.address')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{t('callUs.title')}</h3>
                    <a href="tel:+1234567890" className="text-emerald-600 hover:underline text-sm">
                      {t('callUs.number')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{t('visitUs.title')}</h3>
                    <p className="text-slate-600 text-sm">{t('visitUs.address')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{t('businessHours.title')}</h3>
                    <p className="text-slate-600 text-sm">{t('businessHours.hours')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-[var(--secondary)]">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 text-[var(--foreground)]">{t('quickResponse.title')}</h3>
                <p className="text-sm text-slate-700">{t('quickResponse.description')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="bg-white border-b border-slate-200">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  {t('form.title')}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  {t('form.subtitle')}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      {t('form.successTitle')}
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {t('form.successMessage')}
                    </p>
                    <Button onClick={() => setIsSuccess(false)} variant="outline">
                      {t('form.sendAnother')}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name */}
                    <div>
                      <Label htmlFor="name">{t('form.name')}</Label>
                      <Input id="name" {...register('name')} />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email">{t('form.email')}</Label>
                      <Input id="email" type="email" {...register('email')} />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <Label htmlFor="phone_number">{t('form.phone')}</Label>
                      <Input id="phone_number" {...register('phone_number')} />
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject">{t('form.subject')}</Label>
                      <Select
                        value={selectedSubject}
                        onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t('form.selectSubject')} />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_OPTIONS.map((key) => (
                            <SelectItem key={key} value={t(`subjects.${key}`)}>
                              {t(`subjects.${key}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message">{t('form.message')}</Label>
                      <Textarea id="message" rows={6} {...register('message')} />
                      <p className="text-sm text-slate-500 mt-1">{t('form.hint')}</p>
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full py-6 text-lg">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t('form.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          {t('form.send')}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ */}
        <Card className="mt-12 border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <CardTitle>{t('faq.title')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['responseTime', 'information', 'consultation', 'security'].map((item) => (
                <div key={item}>
                  <h3 className="font-semibold text-slate-900 mb-2">{t(`faq.${item}.question`)}</h3>
                  <p className="text-slate-600 text-sm">{t(`faq.${item}.answer`)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
      <ScrollToTop />
    </main>
  );
}
