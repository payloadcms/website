'use client'

import React from 'react'
import RadioGroup from '@forms/fields/RadioGroup'
import FormComponent from '@forms/Form'

import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import { usePrivacy } from '@root/providers/Privacy'

import classes from './page.module.scss'

export const PrivacyClientPage: React.FC = () => {
  const [trackingCookies, setTrackingCookies] = React.useState<string | null>(null)
  const { cookieConsent, updateCookieConsent } = usePrivacy()

  React.useEffect(() => {
    if (typeof cookieConsent !== 'undefined') {
      setTrackingCookies(cookieConsent ? 'true' : 'false')
    }
    if (cookieConsent) {
      setTrackingCookies('true')
    }
  }, [cookieConsent])

  const handleCookieConsentChange = (newValue: string) => {
    const newConsent = newValue === 'true'
    updateCookieConsent(newConsent, !newConsent)
    setTrackingCookies(newValue)
  }

  return (
    <React.Fragment>
      <BlockWrapper settings={{}} padding={{ top: 'hero' }}>
        <Gutter className={classes.privacyWrap}>
          <div className={['grid'].filter(Boolean).join(' ')}>
            <div className={['cols-10 cols-m-8'].filter(Boolean).join(' ')}>
              <h2>Privacy Policy</h2>
              <p>
                Your privacy is important to us. It is Payload CMS, LLC's policy to respect your
                privacy and comply with any applicable law and regulation regarding any personal
                information we may collect about you, including across our website,&nbsp;
                <a href="https://payloadcms.com/">https://payloadcms.com</a>, and other sites we own
                and operate.
              </p>
              <p>
                Personal information is any information about you which can be used to identify you.
                This includes information about you as a person (such as name, address, and date of
                birth), your devices, payment details, and even information about how you use a
                website or online service.
              </p>
              <p>
                In the event our site contains links to third-party sites and services, please be
                aware that those sites and services have their own privacy policies. After following
                a link to any third-party content, you should read their posted privacy policy
                information about how they collect and use personal information. This Privacy Policy
                does not apply to any of your activities after you leave our site.
              </p>
              <p>This policy is effective as of 6 August 2021.</p>
              <p>Last updated: 24 June 2022</p>
              <h3>Information We Collect</h3>
              <p>
                Information we collect falls into one of two categories: “voluntarily provided”
                information and “automatically collected” information.
              </p>
              <p>
                “Voluntarily provided” information refers to any information you knowingly and
                actively provide us when using or participating in any of our services and
                promotions.
              </p>
              <p>
                “Automatically collected” information refers to any information automatically sent
                by your devices in the course of accessing our products and services.
              </p>
              <h4>Log Data</h4>
              <p>
                When you visit our website, our servers may automatically log the standard data
                provided by your web browser. It may include your device’s Internet Protocol (IP)
                address, your browser type and version, the pages you visit, the time and date of
                your visit, the time spent on each page, and other details about your visit.
              </p>
              <p>
                Additionally, if you encounter certain errors while using the site, we may
                automatically collect data about the error and the circumstances surrounding its
                occurrence. This data may include technical details about your device, what you were
                trying to do when the error happened, and other technical information relating to
                the problem. You may or may not receive notice of such errors, even in the moment
                they occur, that they have occurred, or what the nature of the error is.
              </p>
              <p>
                Please be aware that while this information may not be personally identifying by
                itself, it may be possible to combine it with other data to personally identify
                individual persons.
              </p>
              <h4>Device Data</h4>
              <p>
                When you visit our website or interact with our services, we may automatically
                collect data about your device, such as:
              </p>
              <ul>
                <li>Device Type</li>
                <li>Operating System</li>
              </ul>
              <p>
                Data we collect can depend on the individual settings of your device and software.
                We recommend checking the policies of your device manufacturer or software provider
                to learn what information they make available to us.
              </p>
              <h4>Personal Information</h4>
              <p>
                We may ask for personal information — for example, when you subscribe to our
                newsletter or when you contact us — which may include one or more of the following:
              </p>
              <ul>
                <li>Name</li>
                <li>Email</li>
              </ul>
              <h4>Transaction Data</h4>
              <p>
                Transaction data refers to data that accumulates over the normal course of operation
                on our platform. This may include transaction records, stored files, user profiles,
                analytics data and other metrics, as well as other types of information, created or
                generated, as users interact with our services.
              </p>
              <h4>Legitimate Reasons for Processing Your Personal Information</h4>
              <p>
                We only collect and use your personal information when we have a legitimate reason
                for doing so. In which instance, we only collect personal information that is
                reasonably necessary to provide our services to you.
              </p>
              <h4>Collection and Use of Information</h4>
              <p>
                We may collect personal information from you when you do any of the following on our
                website:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Purchase a license</li>
                <li>Sign up to receive updates from us via email or social media channels</li>
                <li>Use a mobile device or web browser to access our content</li>
                <li>Contact us via email, social media, or on any similar technologies</li>
                <li>When you mention us on social media</li>
              </ul>
              <p>
                We may collect, hold, use, and disclose information for the following purposes, and
                personal information will not be further processed in a manner that is incompatible
                with these purposes:
              </p>
              <ul>
                <li>to provide you with our platform's core features and services</li>
                <li>to contact and communicate with you</li>
                <li>
                  for analytics, market research, and business development, including to operate and
                  improve our website, associated applications, and associated social media
                  platforms
                </li>
                <li>
                  for advertising and marketing, including to send you promotional information about
                  our products and services and information about third parties that we consider may
                  be of interest to you
                </li>
                <li>
                  to enable you to access and use our website, associated applications, and
                  associated social media platforms
                </li>
                <li>
                  to comply with our legal obligations and resolve any disputes that we may have
                </li>
                <li>
                  for security and fraud prevention, and to ensure that our sites and apps are safe,
                  secure, and used in line with our terms of use
                </li>
                <li>
                  for technical assessment, including to operate and improve our app, associated
                  applications, and associated social media platforms
                </li>
              </ul>
              <p>
                We may combine voluntarily provided and automatically collected personal information
                with general information or research data we receive from other trusted sources. For
                example, If you provide us with your location, we may combine this with general
                information about currency and language to provide you with an enhanced experience
                of our site and service.
              </p>
              <h4>Security of Your Personal Information</h4>
              <p>
                When we collect and process personal information, and while we retain this
                information, we will protect it within commercially acceptable means to prevent loss
                and theft, as well as unauthorized access, disclosure, copying, use, or
                modification.
              </p>
              <p>
                Although we will do our best to protect the personal information you provide to us,
                we advise that no method of electronic transmission or storage is 100% secure, and
                no one can guarantee absolute data security.
              </p>
              <p>
                You are responsible for selecting any password and its overall security strength,
                ensuring the security of your own information within the bounds of our services. For
                example, ensuring any passwords associated with accessing your personal information
                and accounts are secure and confidential.
              </p>
              <h4>How Long We Keep Your Personal Information</h4>
              <p>
                We keep your personal information only for as long as we need to. This time period
                may depend on what we are using your information for, in accordance with this
                privacy policy. For example, if you have provided us with personal information as
                part of creating an account with us, we may retain this information for the duration
                your account exists on our system. If your personal information is no longer
                required for this purpose, we will delete it or make it anonymous by removing all
                details that identify you.
              </p>
              <p>
                However, if necessary, we may retain your personal information for our compliance
                with a legal, accounting, or reporting obligation or for archiving purposes in the
                public interest, scientific, or historical research purposes or statistical
                purposes.
              </p>
              <h3>Telemetry</h3>
              <p>
                Payload CMS collects&nbsp;<strong>completely anonymous</strong>&nbsp;telemetry data
                about general usage. Participation in this is completely optional and can be opted
                out of.
              </p>
              <p>
                This data is super important to us and helps us accurately understand how we are
                growing and what we can do to build the software into everything that it can
                possibly be. The telemetry that we collect also help us demonstrate our growth in an
                accurate manner, which helps us as we seek investment to build and scale our team.
                If we can accurately demonstrate our growth, we can more effectively continue to
                support Payload as free and open-source software.
              </p>
              <h5>Specifically, we track the following information:</h5>
              <ul>
                <li>Payload version used</li>
                <li>Node version used</li>
                <li>NODE_ENV</li>
                <li>
                  Environment IDs that help us understand how many active devs are working on
                  Payload at a given time
                </li>
                <li>Anonymous user IDs that sign into the admin panel</li>
                <li>
                  Generated project IDs that help us understand how many projects are currently
                  built using Payload
                </li>
              </ul>
              <p>
                <strong>
                  All values are either completely anonymous or one-way hashed using your own secret
                  key, which means that there is absolutely no way that Payload can use the
                  telemetry data we collect to tie the data back to an individual or project. All
                  data is entirely anonymous.
                </strong>
              </p>
              <h3>Children’s Privacy</h3>
              <p>
                We do not aim any of our products or services directly at children under the age of
                13, and we do not knowingly collect personal information about children under 13.
              </p>
              <h3>Disclosure of Personal Information to Third Parties</h3>
              <p>We may disclose personal information to:</p>
              <ul>
                <li>a parent, subsidiary, or affiliate of our company</li>
                <li>
                  third-party service providers for the purpose of enabling them to provide their
                  services, including (without limitation) IT service providers, data storage,
                  hosting and server providers, analytics, error loggers, debt collectors,
                  maintenance or problem-solving providers, marketing providers, professional
                  advisors, and payment systems operators
                </li>
                <li>our employees, contractors, and/or related entities</li>
                <li>our existing or potential agents or business partners</li>
                <li>
                  credit reporting agencies, courts, tribunals, and regulatory authorities, in the
                  event you fail to pay for goods or services we have provided to you
                </li>
                <li>
                  courts, tribunals, regulatory authorities, and law enforcement officers, as
                  required by law, in connection with any actual or prospective legal proceedings,
                  or in order to establish, exercise, or defend our legal rights
                </li>
                <li>
                  third parties, including agents or sub-contractors, who assist us in providing
                  information, products, services, or direct marketing to you
                </li>
                <li>third parties to collect and process data</li>
                <li>
                  an entity that buys, or to which we transfer all or substantially all of our
                  assets and business
                </li>
              </ul>
              <p>Third parties we currently use include:</p>
              <ul>
                <li>Google Analytics</li>
                <li>Facebook Pixel</li>
                <li>MailChimp</li>
                <li>Stripe</li>
              </ul>
              <h3>Your Rights and Controlling Your Personal Information</h3>
              <p>
                <strong>Your choice:</strong>&nbsp;By providing personal information to us, you
                understand we will collect, hold, use, and disclose your personal information in
                accordance with this privacy policy. You do not have to provide personal information
                to us, however, if you do not, it may affect your use of our website or the products
                and/or services offered on or through it.
              </p>
              <p>
                <strong>Information from third parties:</strong>&nbsp;If we receive personal
                information about you from a third party, we will protect it as set out in this
                privacy policy. If you are a third party providing personal information about
                somebody else, you represent and warrant that you have such person’s consent to
                provide the personal information to us.
              </p>
              <p>
                <strong>Marketing permission:</strong>&nbsp;If you have previously agreed to us
                using your personal information for direct marketing purposes, you may change your
                mind at any time by contacting us using the details below.
              </p>
              <p>
                <strong>Access:</strong>&nbsp;You may request details of the personal information
                that we hold about you.
              </p>
              <p>
                <strong>Correction:</strong>&nbsp;If you believe that any information we hold about
                you is inaccurate, out of date, incomplete, irrelevant, or misleading, please
                contact us using the details provided in this privacy policy. We will take
                reasonable steps to correct any information found to be inaccurate, incomplete,
                misleading, or out of date.
              </p>
              <p>
                <strong>Non-discrimination:</strong>&nbsp;We will not discriminate against you for
                exercising any of your rights over your personal information. Unless your personal
                information is required to provide you with a particular service or offer (for
                example processing transaction data), we will not deny you goods or services and/or
                charge you different prices or rates for goods or services, including through
                granting discounts or other benefits, or imposing penalties, or provide you with a
                different level or quality of goods or services.
              </p>
              <p>
                <strong>Notification of data breaches:</strong>&nbsp;We will comply with laws
                applicable to us in respect of any data breach.
              </p>
              <p>
                <strong>Complaints:</strong>&nbsp;If you believe that we have breached a relevant
                data protection law and wish to make a complaint, please contact us using the
                details below and provide us with full details of the alleged breach. We will
                promptly investigate your complaint and respond to you, in writing, setting out the
                outcome of our investigation and the steps we will take to deal with your complaint.
                You also have the right to contact a regulatory body or data protection authority in
                relation to your complaint.
              </p>
              <p>
                <strong>Unsubscribe:</strong>&nbsp;To unsubscribe from our email database or opt-out
                of communications (including marketing communications), please contact us using the
                details provided in this privacy policy, or opt-out using the opt-out facilities
                provided in the communication. We may need to request specific information from you
                to help us confirm your identity.
              </p>
              <h3>Use of Cookies</h3>
              <p>
                We use “cookies” to collect information about you and your activity across our site.
                A cookie is a small piece of data that our website stores on your computer, and
                accesses each time you visit, so we can understand how you use our site. This helps
                us serve you content based on preferences you have specified.
              </p>
              <p>Please refer to our Cookie Policy for more information.</p>
              <h3>Business Transfers</h3>
              <p>
                If we or our assets are acquired, or in the unlikely event that we go out of
                business or enter bankruptcy, we would include data, including your personal
                information, among the assets transferred to any parties who acquire us. You
                acknowledge that such transfers may occur, and that any parties who acquire us may,
                to the extent permitted by applicable law, continue to use your personal information
                according to this policy, which they will be required to assume as it is the basis
                for any ownership or use rights we have over such information.
              </p>
              <h3>Limits of Our Policy</h3>
              <p>
                Our website may link to external sites that are not operated by us. Please be aware
                that we have no control over the content and policies of those sites, and cannot
                accept responsibility or liability for their respective privacy practices.
              </p>
              <h3>Changes to This Policy</h3>
              <p>
                At our discretion, we may change our privacy policy to reflect updates to our
                business processes, current acceptable practices, or legislative or regulatory
                changes. If we decide to change this privacy policy, we will post the changes here
                at the same link by which you are accessing this privacy policy.
              </p>
              <p>
                If the changes are significant, or if required by applicable law, we will contact
                you (based on your selected preferences for communications from us) and all our
                registered users with the new details and links to the updated or changed policy.
              </p>
              <p>
                If required by law, we will get your permission or give you the opportunity to opt
                in to or opt out of, as applicable, any new uses of your personal information.
              </p>
              <h3>Additional Disclosures for Australian Privacy Act Compliance (AU)</h3>
              <h4>International Transfers of Personal Information</h4>
              <p>
                Where the disclosure of your personal information is solely subject to Australian
                privacy laws, you acknowledge that some third parties may not be regulated by the
                Privacy Act and the Australian Privacy Principles in the Privacy Act. You
                acknowledge that if any such third party engages in any act or practice that
                contravenes the Australian Privacy Principles, it would not be accountable under the
                Privacy Act, and you will not be able to seek redress under the Privacy Act.
              </p>
              <h3>
                Additional Disclosures for General Data Protection Regulation (GDPR) Compliance (EU)
              </h3>
              <h4>Data Controller / Data Processor</h4>
              <p>
                The GDPR distinguishes between organizations that process personal information for
                their own purposes (known as “data controllers”) and organizations that process
                personal information on behalf of other organizations (known as “data processors”).
                We, Payload CMS, LLC, located at the address provided in our Contact Us section, are
                a Data Controller with respect to the personal information you provide to us.
              </p>
              <h4>Legal Bases for Processing Your Personal Information</h4>
              <p>
                We will only collect and use your personal information when we have a legal right to
                do so. In which case, we will collect and use your personal information lawfully,
                fairly, and in a transparent manner. If we seek your consent to process your
                personal information, and you are under 16 years of age, we will seek your parent or
                legal guardian’s consent to process your personal information for that specific
                purpose.
              </p>
              <p>
                Our lawful bases depend on the services you use and how you use them. This means we
                only collect and use your information on the following grounds:
              </p>
              <h5>Consent From You</h5>
              <p>
                Where you give us consent to collect and use your personal information for a
                specific purpose. You may withdraw your consent at any time using the facilities we
                provide; however this will not affect any use of your information that has already
                taken place. You may consent to providing your email address for the purpose of
                receiving marketing emails from us. While you may unsubscribe at any time, we cannot
                recall any email we have already sent. If you have any further enquiries about how
                to withdraw your consent, please feel free to enquire using the details provided in
                the Contact Us section of this privacy policy.
              </p>
              <h5>Performance of a Contract or Transaction</h5>
              <p>
                Where you have entered into a contract or transaction with us, or in order to take
                preparatory steps prior to our entering into a contract or transaction with you. For
                example, if you purchase a product, service, or subscription from us, we may need to
                use your personal and payment information in order to process and deliver your
                order.
              </p>
              <h5>Our Legitimate Interests</h5>
              <p>
                Where we assess it is necessary for our legitimate interests, such as for us to
                provide, operate, improve and communicate our services. We consider our legitimate
                interests to include research and development, understanding our audience, marketing
                and promoting our services, measures taken to operate our services efficiently,
                marketing analysis, and measures taken to protect our legal rights and interests.
              </p>
              <h5>Compliance with Law</h5>
              <p>
                In some cases, we may have a legal obligation to use or keep your personal
                information. Such cases may include (but are not limited to) court orders, criminal
                investigations, government requests, and regulatory obligations. If you have any
                further enquiries about how we retain personal information in order to comply with
                the law, please feel free to enquire using the details provided in the Contact Us
                section of this privacy policy.
              </p>
              <h4>International Transfers Outside of the European Economic Area (EEA)</h4>
              <p>
                We will ensure that any transfer of personal information from countries in the
                European Economic Area (EEA) to countries outside the EEA will be protected by
                appropriate safeguards, for example by using standard data protection clauses
                approved by the European Commission, or the use of binding corporate rules or other
                legally accepted means.
              </p>
              <h4>Your Rights and Controlling Your Personal Information</h4>
              <p>
                <strong>Restrict:</strong>&nbsp;You have the right to request that we restrict the
                processing of your personal information if (i) you are concerned about the accuracy
                of your personal information; (ii) you believe your personal information has been
                unlawfully processed; (iii) you need us to maintain the personal information solely
                for the purpose of a legal claim; or (iv) we are in the process of considering your
                objection in relation to processing on the basis of legitimate interests.
              </p>
              <p>
                <strong>Objecting to processing:</strong>&nbsp;You have the right to object to
                processing of your personal information that is based on our legitimate interests or
                public interest. If this is done, we must provide compelling legitimate grounds for
                the processing which overrides your interests, rights, and freedoms, in order to
                proceed with the processing of your personal information.
              </p>
              <p>
                <strong>Data portability:</strong>&nbsp;You may have the right to request a copy of
                the personal information we hold about you. Where possible, we will provide this
                information in CSV format or other easily readable machine format. You may also have
                the right to request that we transfer this personal information to a third party.
              </p>
              <p>
                <strong>Deletion:</strong>&nbsp;You may have a right to request that we delete the
                personal information we hold about you at any time, and we will take reasonable
                steps to delete your personal information from our current records. If you ask us to
                delete your personal information, we will let you know how the deletion affects your
                use of our website or products and services. There may be exceptions to this right
                for specific legal reasons which, if applicable, we will set out for you in response
                to your request. Please be aware that search engines and similar third parties may
                still retain copies of your personal information that has been made public at least
                once, like certain profile information and public comments, even after you have
                deleted the information from our services or deactivated your account.
              </p>
              <h3>Additional Disclosures for California Compliance (US)</h3>
              <p>
                Under California Civil Code Section 1798.83, if you live in California and your
                business relationship with us is mainly for personal, family, or household purposes,
                you may ask us about the information we release to other organizations for their
                marketing purposes.
              </p>
              <p>
                To make such a request, please contact us using the details provided in this privacy
                policy with “Request for California privacy information” in the subject line. You
                may make this type of request once every calendar year. We will email you a list of
                categories of personal information we revealed to other organizations for their
                marketing purposes in the last calendar year, along with their names and addresses.
                Not all personal information shared in this way is covered by Section 1798.83 of the
                California Civil Code.
              </p>
              <h4>Do Not Track</h4>
              <p>
                Some browsers have a “Do Not Track” feature that lets you tell websites that you do
                not want to have your online activities tracked. At this time, we do not respond to
                browser “Do Not Track” signals.
              </p>
              <p>
                We adhere to the standards outlined in this privacy policy, ensuring we collect and
                process personal information lawfully, fairly, transparently, and with legitimate,
                legal reasons for doing so.
              </p>
              <h4>Cookies and Pixels</h4>
              <p>
                At all times, you may decline cookies from our site if your browser permits. Most
                browsers allow you to activate settings on your browser to refuse the setting of all
                or some cookies. Accordingly, your ability to limit cookies is based only on your
                browser’s capabilities. Please refer to the Cookies section of this privacy policy
                for more information.
              </p>
              <h4>CCPA-permitted financial incentives</h4>
              <p>
                In accordance with your right to non-discrimination, we may offer you certain
                financial incentives permitted by the CCPA that can result in different prices,
                rates, or quality levels for the goods or services we provide.
              </p>
              <p>
                Any CCPA-permitted financial incentive we offer will reasonably relate to the value
                of your personal information, and we will provide written terms that describe
                clearly the nature of such an offer. Participation in a financial incentive program
                requires your prior opt-in consent, which you may revoke at any time.
              </p>
              <h4>California Notice of Collection</h4>
              <p>
                In the past 12 months, we have collected the following categories of personal
                information enumerated in the California Consumer Privacy Act:
              </p>
              <ul>
                <li>
                  Identifiers, such as name, email address, phone number account name, IP address,
                  and an ID or number assigned to your account.
                </li>
                <li>
                  Customer records, such as billing and shipping address, and credit or debit card
                  data.
                </li>
                <li>Commercial information, such as products or services history and purchases.</li>
              </ul>
              <p>
                For more information on information we collect, including the sources we receive
                information from, review the “Information We Collect” section. We collect and use
                these categories of personal information for the business purposes described in the
                “Collection and Use of Information” section, including to provide and manage our
                Service.
              </p>
              <h4>Right to Know and Delete</h4>
              <p>
                If you are a California resident, you have rights to delete your personal
                information we collected and know certain information about our data practices in
                the preceding 12 months. In particular, you have the right to request the following
                from us:
              </p>
              <ul>
                <li>The categories of personal information we have collected about you;</li>
                <li>
                  The categories of sources from which the personal information was collected;
                </li>
                <li>
                  The categories of personal information about you we disclosed for a business
                  purpose or sold;
                </li>
                <li>
                  The categories of third parties to whom the personal information was disclosed for
                  a business purpose or sold;
                </li>
                <li>
                  The business or commercial purpose for collecting or selling the personal
                  information; and
                </li>
                <li>The specific pieces of personal information we have collected about you.</li>
              </ul>
              <p>
                To exercise any of these rights, please contact us using the details provided in
                this privacy policy.
              </p>
              <h4>Shine the Light</h4>
              <p>
                If you are a California resident, in addition to the rights discussed above, you
                have the right to request information from us regarding the manner in which we share
                certain personal information as defined by California’s “Shine the Light” with third
                parties and affiliates for their own direct marketing purposes.
              </p>
              <p>
                To receive this information, send us a request using the contact details provided in
                this privacy policy. Requests must include “California Privacy Rights Request” in
                the first line of the description and include your name, street address, city,
                state, and ZIP code.
              </p>
              <h3>Contact Us</h3>
              <p>
                For any questions or concerns regarding your privacy, you may contact us using the
                following details:
              </p>
              <p>Dan Ribbens</p>
              <p>https://payloadcms.com/contact</p>
              <h2 id="cookies">Cookie Policy</h2>
              <p>
                We use cookies to help improve your experience of our website at&nbsp;
                <a href="https://payloadcms.com/">https://payloadcms.com</a>. This cookie policy is
                part of Payload CMS, LLC's privacy policy. It covers the use of cookies between your
                device and our site.
              </p>
              <p>
                We also provide basic information on third-party services we may use, who may also
                use cookies as part of their service. This policy does not cover their cookies.
              </p>
              <p>
                If you don’t wish to accept cookies from us, you should instruct your browser to
                refuse cookies from&nbsp;
                <a href="https://payloadcms.com/">https://payloadcms.com</a>. In such a case, we may
                be unable to provide you with some of your desired content and services.
              </p>
              <h3>What is a cookie?</h3>
              <p>
                A cookie is a small piece of data that a website stores on your device when you
                visit. It typically contains information about the website itself, a unique
                identifier that allows the site to recognize your web browser when you return,
                additional data that serves the cookie’s purpose, and the lifespan of the cookie
                itself.
              </p>
              <p>
                Cookies are used to enable certain features (e.g. logging in), track site usage
                (e.g. analytics), store your user settings (e.g. time zone, notification
                preferences), and to personalize your content (e.g. advertising, language).
              </p>
              <p>
                Cookies set by the website you are visiting are usually referred to as first-party
                cookies. They typically only track your activity on that particular site.
              </p>
              <p>
                Cookies set by other sites and companies (i.e. third parties) are called third-party
                cookies They can be used to track you on other websites that use the same
                third-party service.
              </p>
              <h3>Types of cookies and how we use them</h3>
              <h4>Essential cookies</h4>
              <p>
                Essential cookies are crucial to your experience of a website, enabling core
                features like user logins, account management, shopping carts, and payment
                processing.
              </p>
              <p>We use essential cookies to enable certain functions on our website.</p>
              <h4>Performance cookies</h4>
              <p>
                Performance cookies track how you use a website during your visit. Typically, this
                information is anonymous and aggregated, with information tracked across all site
                users. They help companies understand visitor usage patterns, identify and diagnose
                problems or errors their users may encounter, and make better strategic decisions in
                improving their audience’s overall website experience. These cookies may be set by
                the website you’re visiting (first-party) or by third-party services. They do not
                collect personal information about you.
              </p>
              <p>We use performance cookies on our site.</p>
              <h4>Functionality cookies</h4>
              <p>
                Functionality cookies are used to collect information about your device and any
                settings you may configure on the website you’re visiting (like language and time
                zone settings). With this information, websites can provide you with customized,
                enhanced, or optimized content and services. These cookies may be set by the website
                you’re visiting (first-party) or by third-party services.
              </p>
              <p>We use functionality cookies for selected features on our site.</p>
              <h4>Targeting/advertising cookies</h4>
              <p>
                Targeting/advertising cookies help determine what promotional content is most
                relevant and appropriate to you and your interests. Websites may use them to deliver
                targeted advertising or limit the number of times you see an advertisement. This
                helps companies improve the effectiveness of their campaigns and the quality of
                content presented to you. These cookies may be set by the website you’re visiting
                (first-party) or by third-party services. Targeting/advertising cookies set by
                third-parties may be used to track you on other websites that use the same
                third-party service.
              </p>
              <p>We use targeting/advertising cookies on our site.</p>
            </div>
            <div className={['cols-10'].filter(Boolean).join(' ')}>
              <h5>Cookie Preferences</h5>
              <FormComponent>
                <RadioGroup
                  onChange={handleCookieConsentChange}
                  initialValue={trackingCookies as string}
                  options={[
                    {
                      label: 'Disabled',
                      value: 'false',
                    },
                    {
                      label: 'Enabled',
                      value: 'true',
                    },
                  ]}
                  className={classes.radioGroup}
                />
              </FormComponent>
              <p>
                Read our <a href="#cookies">Cookie Policy</a> to learn more.
              </p>
            </div>
          </div>
        </Gutter>
      </BlockWrapper>
    </React.Fragment>
  )
}
