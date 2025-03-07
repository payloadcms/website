'use client'

import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'

import classes from './page.module.scss'

export const PrivacyClientPage: React.FC = () => {
  return (
    <React.Fragment>
      <Gutter className={classes.privacyWrap}>
        <div className="grid">
          <div className="cols-12 cols-m-8">
            <h2>Privacy Policy</h2>
            <p>Effective as of March 28, 2024.</p>
            <p>
              This Privacy Policy describes how Payload CMS, Inc. ("<b>Payload</b>," "<b>we</b>", “
              <b>us</b>” or "<b>our</b>") processes personal information that we collect through our
              digital or online properties or services that link to this Privacy Policy (including
              as applicable, our website, mobile application, social media pages, marketing
              activities, live events and other activities described in this Privacy Policy
              (collectively, the “<b>Service</b>”)).
            </p>
            <p>
              Our websites, products and services are designed for enterprise customers and their
              representatives. We do not offer products or services for use by individuals for their
              personal, family or household purposes. Accordingly, we treat all personal information
              we collect as pertaining to individuals in their capacities as representatives of the
              relevant enterprise and not their individual capacities.
            </p>
            <p>
              NOTICE TO EUROPEAN USERS: Please see the{' '}
              <a href="#EuropeanUsers">Notice to European Users</a> section for additional
              information for individuals located in the European Economic Area or United Kingdom
              (which we refer to as “<b>Europe</b>”, and “<b>European</b>” should be understood
              accordingly) below.
            </p>
            <h3>Index</h3>
            <ul>
              <li>
                <a href="#personalInformation">Personal information we collect</a>
              </li>
              <li>
                <a href="#usePersonal">How we use your personal information</a>
              </li>
              <li>
                <a href="#sharePersonal">How we share your personal information</a>
              </li>
              <li>
                <a href="#choices">Your choices</a>
              </li>
              <li>
                <a href="#otherSites">Other sites and services</a>
              </li>
              <li>
                <a href="#security">Security</a>
              </li>
              <li>
                <a href="#internationalData">International data transfers</a>
              </li>
              <li>
                <a href="#children">Children</a>
              </li>
              <li>
                <a href="#changesToPrivacy">Changes to this Privacy Policy</a>
              </li>
              <li>
                <a href="#contactUs">How to contact us</a>
              </li>
              <li>
                <a href="#EuropeanUsers">Notice to European users</a>
              </li>
            </ul>
            <h3 id="personalInformation">Personal information we collect</h3>
            <p>
              <b>Information you provide to us</b>. Personal information you may provide to us
              through the Service or otherwise includes:
            </p>
            <ul>
              <li>
                <b>Contact data</b>, such as your first and last name, salutation, email address,
                billing and mailing addresses, professional title and company name, and phone
                number.
              </li>
              <li>
                <b>Demographic data</b>, such as your city, state, country of residence, and postal
                code.
              </li>
              <li>
                <b>Profile data</b>, such as the username and password that you may set to establish
                an online account on the Service, redemption code, and any other information that
                you add to your account profile.
              </li>
              <li>
                <b>Communications data</b> based on our exchanges with you, including when you
                contact us through the Service, social media, or otherwise.
              </li>
              <li>
                <b>Transactional data</b>, such as information relating to or needed to complete
                your orders on or through the Service, including order numbers and transaction
                history.
              </li>
              <li>
                <b>Marketing data</b>, such as your preferences for receiving our marketing
                communications and details about your engagement with them.
              </li>
              <li>
                <b>Payment data</b> needed to complete transactions, including payment card
                information or bank account number.
              </li>
              <li>
                <b>Other data</b> not specifically listed here, which we will use as described in
                this Privacy Policy or as otherwise disclosed at the time of collection.
              </li>
            </ul>
            <p>
              <b>Third-party sources</b>. We may combine personal information we receive from you
              with personal information we obtain from other sources, such as:
            </p>
            <ul>
              <li>
                <b>Public sources</b>, such as government agencies, public records, social media
                platforms, and other publicly available sources.
              </li>
              <li>
                <b>Marketing partners</b>, such as joint marketing partners and event co-sponsors.
              </li>
              <li>
                <b>Our affiliate partners</b>, such as our affiliate network provider and
                publishers, influencers, and promoters who participate in our paid affiliate
                programs.
              </li>
              <li>
                <b>Third-party services</b>, such as third-party services that you use to log into,
                or otherwise link to, your Service account. This data may include your username,
                profile picture and other information associated with your account on that
                third-party service that is made available to us based on your account settings on
                that service.
              </li>
            </ul>
            <p>
              <b>Automatic data collection</b>. We, our service providers, and our business partners
              may automatically log information about you, your computer or mobile device, and your
              interaction over time with the Service, our communications and other online services,
              such as:
            </p>
            <ul>
              <li>
                <b>Device data</b>, such as your computer or mobile device’s operating system type
                and version, manufacturer and model, browser type, screen resolution, RAM and disk
                size, CPU usage, device type (e.g., phone, tablet), IP address, unique identifiers
                (including identifiers used for advertising purposes), language settings, mobile
                device carrier, radio/network information (e.g., Wi-Fi, LTE, 3G) and general
                location information such as city, state or geographic area.
              </li>
              <li>
                <b>Activity data</b>, such as pages or screens you viewed, how long you spent on a
                page or screen, the website you visited before browsing to the Service, navigation
                paths between pages or screens, information about your activity on a page or screen,
                access times and duration of access, and utilization of the Services (including
                server utilization, file and database storage activity, and mail transport volume).
              </li>
              <li>
                <b>Precise geolocation data</b> when you authorize the Service to access your
                device’s location.
              </li>
              <li>
                <b>Communication interaction data</b> such as your interactions with our email, text
                or other communications (e.g., whether you open and/or forward emails) – we may do
                this through use of pixel tags (which are also known as clear GIFs), which may be
                embedded invisibly in our emails.{' '}
              </li>
            </ul>
            <p>
              <b>Cookies</b>. Some of our automatic data collection is facilitated by cookies and
              similar technologies. For more information, see our Cookie Notice. We will also store
              a record of your preferences in respect of the use of these technologies in connection
              with the Service.
            </p>
            <p>
              <b>Data about others</b>. We may offer features that help users invite their contacts
              to use the Service, and we may collect contact details about these invitees so we can
              deliver their invitations. Please do not refer someone to us or share their contact
              details with us unless you have their permission to do so.
            </p>
            <h3 id="usePersonal">How we use your personal information</h3>
            <p>
              We may use your personal information for the following purposes or as otherwise
              described at the time of collection:
            </p>
            <p>
              <b>Service delivery and operations</b>. We may use your personal information to:
            </p>
            <ul>
              <li>provide, operate and improve the Service and our business;</li>
              <li>
                personalize the service, including remembering the devices from which you have
                previously logged in and remembering your selections and preferences as you navigate
                the Service;
              </li>
              <li>establish and maintain your user profile on the Service;</li>
              <li>
                facilitate your invitations to contacts who you want to invite to join the Service;
              </li>
              <li>
                enable security features of the Service, such as by sending you security codes via
                email or SMS and remembering devices from which you have previously logged in;
              </li>
              <li>
                communicate with you about the Service, including by sending Service-related
                announcements, updates, security alerts and support and administrative messages;
              </li>
              <li>
                understand your needs and interests, and personalize your experience with the
                Service and our communications; and
              </li>
              <li>
                provide support for the Service, and respond to your requests, questions and
                feedback.
              </li>
            </ul>
            <p>
              <b>Research and development</b>. We may use your personal information for research and
              development purposes, including to analyze and improve the Service and our business
              and to develop new products and services.
            </p>
            <p>
              <b>Marketing and advertising</b>. We, our third-party advertising partners and our
              service providers may collect and use your personal information for marketing and
              advertising purposes.
            </p>
            <ul>
              <li>
                <b>Direct marketing</b>. We may send you direct marketing communications and may
                personalize these messages based on your needs and interests. You may opt-out of our
                marketing communications as described in the{' '}
                <a href="#optOut">Opt-out of marketing</a> section below.
              </li>
              <li>
                <b>Interest-based advertising</b>. Our third-party advertising partners may use
                cookies and similar technologies to collect information about your interaction
                (including the data described in the automatic data collection section above) with
                the Service, our communications and other online services over time, and use that
                information to serve online ads that they think will interest you. This is called
                interest-based advertising. We may also share information about our users with these
                companies to facilitate interest-based advertising to those or similar users on
                other online platforms. You can learn more about your choices for limiting
                interest-based advertising in the Your choices section of our Cookie Notice.
              </li>
            </ul>
            <p id="serviceImprovement">
              <b>Service improvement and analytics</b>. We may use your personal information to
              analyze your usage of the Service, improve the Service, improve the rest of our
              business, help us understand user activity on the Service, including which pages are
              most and least visited and how visitors move around the Service, as well as user
              interactions with our emails, and to develop new products and services.
            </p>
            <p>
              <b>Compliance and protection</b>. We may use your personal information to:
            </p>
            <ul>
              <li>
                comply with applicable laws, lawful requests and legal process, such as to respond
                to subpoenas, investigations or requests from government authorities;
              </li>
              <li>
                protect our, your or others’ rights, privacy, safety or property (including by
                making and defending legal claims);
              </li>
              <li>
                audit our internal processes for compliance with legal and contractual requirements
                or our internal policies;
              </li>
              <li>enforce the terms and conditions that govern the Service; and</li>
              <li>
                prevent, identify, investigate and deter fraudulent, harmful, unauthorized,
                unethical or illegal activity, including cyberattacks and identity theft.
              </li>
            </ul>
            <p>
              <b>With your consent</b>. In some cases, we may specifically ask for your consent to
              collect, use or share your personal information, such as when required by law.
            </p>
            <p>
              <b>To create aggregated, de-identified and/or anonymized data</b>. We may create
              aggregated, de-identified and/or anonymized data from your personal information and
              other individuals whose personal information we collect. We make personal information
              into de-identified and/or anonymized data by removing information that makes the data
              identifiable to you. We may use this aggregated, de-identified and/or anonymized data
              and share it with third parties for our lawful business purposes, including to analyze
              and improve the Service and promote our business.
            </p>
            <h3 id="sharePersonal">How we share your personal information</h3>
            <p>
              We may share your personal information with the following parties and as otherwise
              described in this Privacy Policy, in other applicable notices, or at the time of
              collection.
            </p>
            <p>
              <b>Affiliates</b>. Our corporate parent, subsidiaries, and affiliates.
            </p>
            <p>
              <b>Service providers</b>. Third parties that provide services on our behalf or help us
              operate the Service or our business (such as hosting, information technology, customer
              support, email delivery, marketing, consumer research and website analytics).
            </p>
            <p>
              <b>Payment processors</b>. Any payment card information you use to make a purchase on
              the Service is collected and processed directly by our payment processors, such as
              Stripe. Stripe may use your payment data in accordance with its privacy policy,{' '}
              <a href="https://stripe.com/privacy" target="_blank">
                https://stripe.com/privacy
              </a>
              .
            </p>
            <p>
              <b>Advertising partners</b>. Third-party advertising companies for the interest-based
              advertising purposes described above.
            </p>
            <p>
              <b>Third parties designated by you</b>. We may share your personal information with
              third parties where you have instructed us or provided your consent to do so. We will
              share personal information that is needed for these other companies to provide the
              services that you have requested.
            </p>
            <p>
              <b>Business and marketing partners</b>. Third parties with whom we jointly offer
              products or services, or whose products or services may be of interest to you.
            </p>
            <p>
              <b>Linked third-party services</b>. If you log into the Service with, or otherwise
              link your Service account to, a third-party service, we may share your personal
              information with that third-party service. The third party’s use of the shared
              information will be governed by its privacy policy and the settings associated with
              your account with the third-party service.
            </p>
            <p>
              <b>Professional advisors</b>. Professional advisors, such as lawyers, auditors,
              bankers and insurers, where necessary in the course of the professional services that
              they render to us.
            </p>
            <p>
              <b>Authorities and others</b>. Law enforcement, government authorities and private
              parties, as we believe in good faith to be necessary or appropriate for the{' '}
              <a href="#serviceImprovement">Compliance and protection purposes</a> described above.
            </p>
            <p>
              <b>Business transferees</b>. We may disclose personal information in the context of
              actual or prospective business transactions (e.g., investments in Payload, financing
              of Payload, public stock offerings or the sale, transfer or merger of all or part of
              our business, assets or shares), for example, we may need to share certain personal
              information with prospective counterparties and their advisers. We may also disclose
              your personal information to an acquirer, successor or assignee of Payload as part of
              any merger, acquisition, sale of assets, or similar transaction and/or in the event of
              an insolvency, bankruptcy or receivership in which personal information is transferred
              to one or more third parties as one of our business assets.
            </p>
            <h3 id="choices">Your choices </h3>
            <p>
              In this section, we describe the rights and choices available to all users. Users who
              are located in Europe can find additional information about their rights below.
            </p>
            <p>
              <b>Access or update your information</b>. If you have registered for an account with
              us through the Service, you may review and update certain account information by
              logging into the account.
            </p>
            <p id="optOut">
              <b>Opt-out of communications</b>. You may opt-out of marketing-related emails by
              following the opt-out or unsubscribe instructions at the bottom of the email, or by{' '}
              <a href="#contactUs">contacting us</a>. Please note that if you choose to opt-out of
              marketing-related emails, you may continue to receive service-related and other
              non-marketing emails.
            </p>
            <p>
              <b>Cookies</b>. For information about cookies employed by the Service and how to
              control them, see our Cookie Notice.
            </p>
            <p>
              <b>Blocking images/clear gifs</b>: Most browsers and devices allow you to configure
              your device to prevent images from loading. To do this, follow the instructions in
              your particular browser or device settings.
            </p>
            <p>
              <b>Mobile location data</b>. You can disable our access to your device’s precise
              geolocation in your mobile device settings.
            </p>
            <p>
              <b>Advertising choices</b>. You may be able to limit use of your information for
              interest-based advertising through the following settings/options/tools:
            </p>
            <ul>
              <li>
                <b>Browser settings</b>. Changing your internet web browser settings to block
                third-party cookies.
              </li>
              <li>
                <b>Privacy browsers/plug-ins</b>. Using privacy browsers and/or ad-blocking browser
                plug-ins that let you block tracking technologies.
              </li>
              <li>
                <b>Platform settings</b>. Google and Facebook offer opt-out features that let you
                opt-out of use of your information for interest-based advertising. You may be able
                to exercise that option at the following websites:
                <ul>
                  <li>
                    Google:{' '}
                    <a href="https://adssettings.google.com/" target="_blank">
                      https://adssettings.google.com/
                    </a>
                  </li>
                  <li>
                    Facebook:{' '}
                    <a href="https://www.facebook.com/about/ads" target="_blank">
                      https://www.facebook.com/about/ads
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <b>Ad industry tools</b>. Opting out of interest-based ads from companies that
                participate in the following industry opt-out programs:
                <ul>
                  <li>
                    Network Advertising Initiative:{' '}
                    <a href="https://thenai.org/opt-out/" target="_blank">
                      https://thenai.org/opt-out/
                    </a>
                  </li>
                  <li>
                    Digital Advertising Alliance:{' '}
                    <a href="https://optout.aboutads.info/?c=2&lang=EN" target="_blank">
                      https://optout.aboutads.info/?c=2&lang=EN
                    </a>
                  </li>
                  <li>
                    AppChoices mobile app, available at{' '}
                    <a href="https://www.youradchoices.com/appchoices" target="_blank">
                      https://www.youradchoices.com/appchoices
                    </a>
                    , which will allow you to opt-out of interest-based ads in mobile apps served by
                    participating members of the Digital Advertising Alliance.
                  </li>
                </ul>
              </li>
              <li>
                <b>Mobile settings</b>. Using your mobile device settings to limit use of the
                advertising ID associated with your mobile device for interest-based advertising
                purposes.
              </li>
            </ul>
            <p>
              You will need to apply these opt-out settings on each device and browser from which
              you wish to limit the use of your information for interest-based advertising purposes.
            </p>
            <p>
              <b>Do Not Track</b>. Some Internet browsers may be configured to send “Do Not Track”
              signals to the online services that you visit. We currently do not respond to “Do Not
              Track” signals. To find out more about “Do Not Track,” please visit{' '}
              <a href="http://www.allaboutdnt.com" target="_blank">
                http://www.allaboutdnt.com
              </a>
              .
            </p>
            <p>
              <b>Declining to provide information</b>. We need to collect personal information to
              provide certain services. If you do not provide the information we identify as
              required or mandatory, we may not be able to provide those services
            </p>
            <p>
              <b>Linked third-party platforms</b>. If you choose to connect to the Service through a
              third-party platform, you may be able to use your settings in your account with that
              platform to limit the information we receive from it. If you revoke our ability to
              access information from a third-party platform, that choice will not apply to
              information that we have already received from that third party.
            </p>
            <h3 id="otherSites">Other sites and services</h3>
            <p>
              The Service may contain links to websites, mobile applications and other online
              services operated by third parties. In addition, our content may be integrated into
              web pages or other online services that are not associated with us. These links and
              integrations are not an endorsement of, or representation that we are affiliated with,
              any third party. We do not control websites, mobile applications or online services
              operated by third parties, and we are not responsible for their actions. We encourage
              you to read the privacy policies of the other websites, mobile applications and online
              services you use.
            </p>
            <h3 id="security">Security</h3>
            <p>
              We employ technical, organizational and physical safeguards designed to protect the
              personal information we collect. However, security risk is inherent in all internet
              and information technologies, and we cannot guarantee the security of your personal
              information.
            </p>
            <h3 id="internationalData">International data transfer</h3>
            <p>
              We are headquartered in the United States and may use service providers that operate
              in other countries. Your personal information may be transferred to the United States
              or other locations where privacy laws may not be as protective as those in your state,
              province, or country.
            </p>
            <p>
              Users in Europe should read the important information provided below about transfer of
              personal information outside of Europe.
            </p>
            <h3 id="children">Children</h3>
            <p>
              The Service is not intended for use by anyone under 18 years of age. If you are a
              parent or guardian of a child from whom you believe we have collected personal
              information in a manner prohibited by law, please <a href="#contactUs">contact us</a>.
              If we learn that we have collected personal information through the Service from a
              child without the consent of the child’s parent or guardian as required by law, we
              will comply with applicable legal requirements to delete the information.
            </p>
            <h3 id="changesToPrivacy">Changes to this Privacy Policy </h3>
            <p>
              We reserve the right to modify this Privacy Policy at any time. If we make material
              changes to this Privacy Policy, we will notify you by updating the date of this
              Privacy Policy and posting it on the Service or other appropriate means. Any
              modifications to this Privacy Policy will be effective upon our posting the modified
              version (or as otherwise indicated at the time of posting). In all cases, your use of
              the Service after the effective date of any modified Privacy Policy indicates your
              acknowledging that the modified Privacy Policy applies to your interactions with the
              Service and our business.
            </p>
            <h3 id="contactUs">How to contact us</h3>
            <ul>
              <li>
                <b>Email</b>: legal@payloadcms.com
              </li>
              <li>
                <b>Mail</b>: 624 Stocking NW. Grand Rapids, MI 49504
              </li>
            </ul>
            <h3 id="EuropeanUsers">Notice to European users</h3>
            <h5>General</h5>
            <p>
              <b>Where this Notice to European users applies</b>. The information provided in this
              “Notice to European users” section applies only to individuals in the United Kingdom
              and the European Economic Area (i.e., “<b>Europe</b>” as defined at the top of this
              Privacy Policy).
            </p>
            <p>
              <b>Personal information</b>. References to “personal information” in this Privacy
              Policy should be understood to include a reference to “personal data” (as defined in
              the GDPR) – i.e., information about individuals from they are either directly
              identified or can be identified.{' '}
            </p>
            <p>
              <b>Controller</b>. Payload CMS, Inc. (“<b>Payload</b>”) is the controller in respect
              of the processing of your personal information covered by this Privacy Policy for
              purposes of European data protection legislation (i.e., the{' '}
              <a
                href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679&from=EN"
                target="_blank"
              >
                EU GDPR
              </a>{' '}
              and the so-called ‘
              <a
                href="https://www.gov.uk/government/publications/data-protection-law-eu-exit"
                target="_blank"
              >
                UK GDPR
              </a>
              ’ (as and where applicable, the “<b>GDPR</b>”)). See the ‘How to contact us’ section
              above for our contact details.
            </p>
            <h5>General Data Protection Regulation (GDPR)</h5>
            <p>
              <b>European Representative</b>. Pursuant to Article 27 of the General Data Protection
              Regulation (GDPR), Payload CMS, Inc. has appointed European Data Protection Office
              (EDPO) as its GDPR Representative in the EU. You can contact EDPO regarding matters
              pertaining to the GDPR:
              <ul>
                <li>
                  by using EDPO’s online request form:{' '}
                  <a href="https://edpo.com/gdpr-data-request/" target="_blank">
                    https://edpo.com/uk-gdpr-data-request
                  </a>
                </li>
                <li>by writing to EDPO at Avenue Huart Hamoir 71, 1030 Brussels, Belgium</li>
              </ul>
            </p>
            <h5>UK General Data Protection Regulation (GDPR)</h5>
            <p>
              <b>UK Representative</b>. Pursuant to Article 27 of the UK GDPR, Payload CMS, Inc. has
              appointed EDPO UK Ltd as its UK GDPR representative in the UK. You can contact EDPO UK
              regarding matters pertaining to the UK GDPR:
              <ul>
                <li>
                  by using EDPO’s online request form:{' '}
                  <a href="https://edpo.com/uk-gdpr-data-request/" target="_blank">
                    https://edpo.com/uk-gdpr-data-request
                  </a>
                </li>
                <li>
                  by writing to EDPO UK at 8 Northumberland Avenue, London WC2N 5BY, United Kingdom
                </li>
              </ul>
            </p>
            <h5>Our legal bases for processing</h5>
            <p>
              In respect of each of the purposes for which we use your personal information, the
              GDPR requires us to ensure that we have a “legal basis” for that use.
            </p>
            <p>
              Our legal bases for processing your personal information described in this Privacy
              Policy are listed below.
            </p>
            <ul>
              <li>
                Where we need to perform a contract, we are about to enter into or have entered into
                with you (“<b>Contractual Necessity</b>”).
              </li>
              <li>
                Where it is necessary for our legitimate interests and your interests and
                fundamental rights do not override those interests (“<b>Legitimate Interests</b>”).
                More detail about the specific legitimate interests pursued in respect of each
                Purpose we use your personal information for is set out in the table below.
              </li>
              <li>
                Where we need to comply with a legal or regulatory obligation (“
                <b>Compliance with Law</b>”).
              </li>
              <li>
                Where we have your specific consent to carry out the processing for the purpose in
                question (“<b>Consent</b>").
              </li>
            </ul>
            <p>
              We have set out below, in a table format, the legal bases we rely on in respect of the
              relevant purposes for which we use your personal information – for more information on
              these purposes and the data types involved, see ‘How we use your personal
              information’.
            </p>
            <div className={classes.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>Purpose</th>
                    <th>Categories of personal information involved</th>
                    <th>Legal basis</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Service delivery and operations</b>
                    </td>
                    <td>
                      <ul>
                        <li>Contact data</li>
                        <li>Demographic data</li>
                        <li>Profile data</li>
                        <li>Communication data</li>
                        <li>Transactional data</li>
                        <li>Marketing data</li>
                        <li>Payment data</li>
                        <li>Device data</li>
                        <li>Usage data</li>
                      </ul>
                    </td>
                    <td>Contractual Necessity</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Research and development</b>
                    </td>
                    <td>
                      <p>Any and all data types relevant in the circumstances</p>
                    </td>
                    <td>
                      Legitimate interest. We have legitimate interest, and believe it is also in
                      your interests, that we are able to take steps to ensure that our services and
                      how we use personal information is as un-privacy intrusive as possible.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Direct marketing</b>
                    </td>
                    <td>
                      <ul>
                        <li>Contact data</li>
                        <li>Communication data</li>
                        <li>Transactional data</li>
                        <li>Marketing data</li>
                        <li>Online activity data</li>
                        <li>Communication interaction data</li>
                      </ul>
                    </td>
                    <td>
                      <p>
                        Legitimate Interests. We have a legitimate interest in promoting our
                        operations and goals as an organization and sending marketing communications
                        for that purpose.
                      </p>
                      <p>
                        Consent, in circumstances or in jurisdictions where consent is required
                        under applicable data protection laws to the sending of any given marketing
                        communications.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Interest-based advertising</b>
                    </td>
                    <td>
                      <ul>
                        <li>Online activity data</li>
                        <li>Device data</li>
                      </ul>
                    </td>
                    <td>Consent</td>
                  </tr>
                  <tr>
                    <td>
                      <b>Service improvement and analytics</b>
                    </td>
                    <td>
                      <ul>
                        <li>Profile data</li>
                        <li>Device data</li>
                        <li>Online activity data</li>
                        <li>Communication interaction data</li>
                      </ul>
                    </td>
                    <td>
                      <p>
                        Legitimate Interests. We have a legitimate interest in understanding better
                        your interests to enhance and personalize your experience while using our
                        Service.
                      </p>
                      <p>
                        Consent, in circumstances or in jurisdictions where consent is required
                        under applicable data protection laws to personalize the users’ experience.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Compliance and protection</b>
                    </td>
                    <td>Any and all data types relevant in the circumstances</td>
                    <td>
                      <p>Compliance with Law.</p>
                      <p>
                        Legitimate interest. Where Compliance with Law is not applicable, we and any
                        relevant third parties have a legitimate interest in participating in,
                        supporting, and following legal process and requests, including through
                        co-operation with authorities. We and any relevant third parties may also
                        have a legitimate interest of ensuring the protection, maintenance, and
                        enforcement of our and their rights, property, and/or safety.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>To create aggregated, de-identified and/or anonymized data</b>
                    </td>
                    <td>Any and all data types relevant in the circumstances</td>
                    <td>
                      Legitimate interest. We have legitimate interest, and believe it is also in
                      your interests, that we are able to take steps to ensure that our services and
                      how we use personal information is as un-privacy intrusive as possible.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Further uses</b>
                    </td>
                    <td>Any and all data types relevant in the circumstances</td>
                    <td>
                      <p>
                        The original legal basis relied upon, if the relevant further use is
                        compatible with the initial purpose for which the personal information was
                        collected.
                      </p>
                      <p>
                        Consent, if the relevant further use is not compatible with the initial
                        purpose for which the personal information was collected.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h5>Other info</h5>
            <p>
              <b>No sensitive personal information</b>. We ask that you not provide us with any
              sensitive personal information (e.g., social security numbers, information related to
              racial or ethnic origin, political opinions, religion or other beliefs, health, or
              genetic characteristics, criminal background or trade union membership) on or through
              the Service, or otherwise to us. If you provide us with any sensitive personal
              information to us when you use the Service, you must consent to our processing and use
              of such sensitive personal information in accordance with this Privacy Policy. If you
              do not consent to our processing and use of such sensitive personal information, you
              must not submit such sensitive personal information through our Service.
            </p>
            <p>
              <b>No Automated Decision-Making and Profiling</b>. As part of the Service, we do not
              engage in automated decision-making and/or profiling, which produces legal or
              similarly significant effects.{' '}
            </p>
            <h5>Your rights</h5>
            <p>
              <b>General</b>. European data protection laws give you certain rights regarding your
              personal information. If you are located in Europe, you may ask us to take the
              following actions in relation to your personal information that we hold:
            </p>
            <ul>
              <li>
                <b>Access</b>. Provide you with information about our processing of your personal
                information and give you access to your personal information.
              </li>
              <li>
                <b>Correct</b>. Update or correct inaccuracies in your personal information.
              </li>
              <li>
                <b>Delete</b>. Delete your personal information where there is no lawful reason for
                us continuing to store or process it, where you have successfully exercised your
                right to object to processing (see below), where we may have processed your
                information unlawfully or where we are required to erase your personal information
                to comply with local law. Note, however, that we may not always be able to comply
                with your request of erasure for specific legal reasons that will be described to
                you, if applicable, at the time of your request.
              </li>
              <li>
                <b>Portability</b>. Port a machine-readable copy of your personal information to you
                or a third party of your choice, in certain circumstances. Note that this right only
                applies to automated information for which you initially provided consent for us to
                use or where we used the information to perform a contract with you.
              </li>
              <li>
                <b>Restrict</b>. Restrict the processing of your personal information, if, (i) you
                want us to establish the personal information's accuracy; (ii) where our use of the
                personal information is unlawful but you do not want us to erase it; (iii) where you
                need us to hold the personal information even if we no longer require it as you need
                it to establish, exercise or defend legal claims; or (iv) you have objected to our
                use of your personal information but we need to verify whether we have overriding
                legitimate grounds to use it.
              </li>
              <li>
                <b>Object</b>. Object to our processing of your personal information where we are
                relying on Legitimate Interests (or those of a third party) and there is something
                about your particular situation that makes you want to object to processing on this
                ground as you feel it impacts on your fundamental rights and freedom – you also have
                the right to object where we are processing your personal information for direct
                marketing purposes.
              </li>
              <li>
                <b>Withdraw Consent</b>. When we use your personal information based on your
                consent, you have the right to withdraw that consent at any time. This will not
                affect the lawfulness of any processing carried out before you withdraw your
                consent.
              </li>
            </ul>
            <p>
              <b>Exercising These Rights</b>. You may submit these requests by email to
              [legal@payloadcms.com] or our postal address provided above. We may request specific
              information from you to help us confirm your identity and process your request.
              Whether or not we are required to fulfill any request you make will depend on a number
              of factors (e.g., why and how we are processing your personal information), if we
              reject any request you may make (whether in whole or in part) we will let you know our
              grounds for doing so at the time, subject to any legal restrictions.
            </p>
            <p>
              <b>Your Right to Lodge a Complaint with your Supervisory Authority</b>. In addition to
              your rights outlined above, if you are not satisfied with our response to a request
              you make, or how we process your personal information, you can make a complaint to the
              data protection regulator in your habitual place of residence.
            </p>
            <ul>
              <li>
                For users in the European Economic Area – the contact information for the data
                protection regulator in your place of residence can be found here:{' '}
                <a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank">
                  https://edpb.europa.eu/about-edpb/board/members_en
                </a>
              </li>
              <li>
                For users in the UK – the contact information for the UK data protection regulator
                is below:
                <p>The Information Commissioner’s Office</p>
                <p>Water Lane, Wycliffe House</p>
                <p>Wilmslow - Cheshire SK9 5AF</p>
                <p>Tel. +44 303 123 1113</p>
                <p>
                  Website:{' '}
                  <a href="https://ico.org.uk/make-a-complaint/" target="_blank">
                    https://ico.org.uk/make-a-complaint/
                  </a>
                </p>
              </li>
            </ul>
            <h5>Data Processing outside Europe</h5>
            <p>
              We are a U.S.-based company and many of our service providers, advisers, partners or
              other recipients of data are also based in the U.S. This means that, if you use the
              Service, your personal information will necessarily be accessed and processed in the
              U.S. It may also be provided to recipients in other countries outside Europe.
            </p>
            <p>
              It is important to note that that the U.S. is not the subject of an ‘adequacy
              decision’ under the GDPR – basically, this means that the U.S. legal regime is not
              considered by relevant European bodies to provide an adequate level of protection for
              personal information, which is equivalent to that provided by relevant European laws.
            </p>
            <p>
              Where we share your personal information with third parties who are based outside
              Europe, we try to ensure a similar degree of protection is afforded to it by making
              sure one of the following mechanisms is implemented:
            </p>
            <ul>
              <li>
                <b>Transfers to territories with an adequacy decision</b>. We may transfer your
                personal information to countries or territories whose laws have been deemed to
                provide an adequate level of protection for personal information by the European
                Commission or UK Government (as and where applicable) (from time to time).
              </li>
              <li>
                <b>Transfers to territories without an adequacy decision</b>.
                <ul>
                  <li>
                    We may transfer your personal information to countries or territories whose laws
                    have <b>not</b> been deemed to provide such an adequate level of protection
                    (e.g., the U.S., see above).
                  </li>
                  <li>
                    However, in these cases:
                    <ul>
                      <li>
                        we may use specific appropriate safeguards, which are designed to give
                        personal information effectively the same protection it has in Europe – for
                        example, standard-form contracts approved by relevant authorize for this
                        purpose; or
                      </li>
                      <li>
                        in limited circumstances, we may rely on an exception, or ‘derogation’,
                        which permits us to transfer your personal information to such country
                        despite the absence of an ‘adequacy decision’ or ‘appropriate safeguards’ –
                        for example, reliance on your explicit consent to that transfer.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
            <p>
              You may contact us if you want further information on the specific mechanism used by
              us when transferring your personal information out of Europe.
            </p>
          </div>
        </div>
      </Gutter>
    </React.Fragment>
  )
}
