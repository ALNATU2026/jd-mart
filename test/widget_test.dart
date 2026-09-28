import 'package:flutter_test/flutter_test.dart';

import 'package:jdmart/main.dart';

void main() {
  testWidgets('JD Mart dashboard loads', (tester) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    expect(find.text('JD Mart Platform'), findsOneWidget);
  });
}
